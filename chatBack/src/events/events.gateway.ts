import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { MessageService } from 'src/message/message.service';
import { UsersService } from 'src/users/users.service';
import { BotService } from 'src/users/bot/bot.service';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');
  private users = [];
  private botSub;

  constructor(
    private readonly messageService: MessageService,
    private readonly botService: BotService,
    private readonly usersService: UsersService
  ) {}

  @SubscribeMessage('authUser')
  async identity(client: Socket): Promise<any> {
    const newUser = await this.usersService.createUser();
    
    this.users = this.users.map( user => user.clientId === client.id ? { clientId: client.id, ...newUser } : user )

    this.server.emit('usersList', (await this.usersService.findAllUsers()) )
    this.server.emit('usersConnection', this.users )
    return { event: 'authUser', data: newUser };
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, ...args: any[]): Promise<any> {
    
    const sender = this.users.find( user => user.clientId === client.id )
    if( args[0].receiver.type !== 'client' ) {

      client.emit('message', await this.messageService.saveMessage(sender, args[0].receiver, args[0].text) )
      
      const messageFromBot = await this.botService.botAnswer(sender, args[0].receiver, args[0].text)
      
      return {event: 'message', data: messageFromBot };

    } else {

      const receiver = this.users.find( user => user.id === args[0].receiver.id )
      const message = await this.messageService.saveMessage(sender, receiver, args[0].text) 
                      
      this.server.to(receiver.clientId).emit('message', message);

      return {event: 'message', data: message } ;
    }
  }
  
  @SubscribeMessage('startChat') 
  handleStartChat(client: Socket, args: { receiver: Users } ) {
    const sender = this.users.find( user => user.clientId === client.id )

    if ( args.receiver.type !== 'client' ) {
      this.botSub = this.botService.track(sender, args.receiver).subscribe( msg => {
        client.emit('message', msg); 
      } )
    } else {
      this.botService.untrack();
      if (this.botSub) {
        this.botSub.unsubscribe();
      }
    }

  }

  afterInit() {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.refreshActivity()
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket) {

    this.refreshActivity();
    
    client.emit('usersList', (await this.usersService.findAllUsers()) )
    client.emit('usersConnection', this.users )

    this.logger.log(`Client connected: ${client.id}`);
  }

  private async refreshActivity() {
    const clientIdList: string[] = await new Promise(resolve => {
      this.server
        .clients((err, clients: string[]) => resolve(clients));
    })

    this.users = await Promise.all(clientIdList.map( async (clientId: string) => {
          return { clientId,  ...(JSON.parse((this.server.sockets.connected[clientId] as any).handshake.query.user)) 
        } ;
    }));
    this.server.emit('usersList', (await this.usersService.findAllUsers()) )
    this.server.emit('usersConnection', this.users )
  }

}
