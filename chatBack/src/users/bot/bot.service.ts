import { Injectable } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/message.entity';
import { Users } from '../users.entity';
import { Subject } from 'rxjs';
import { lorem } from 'faker';


@Injectable()
export class BotService {
    
    timer: NodeJS.Timeout 

    constructor(private readonly messageService: MessageService) {}

    async botAnswer( sender: Users, receiver: Users, text: string ): Promise<Message | void> {
        
        if ( receiver.type === 'bot.echo' ) {
            return await this.messageService.saveMessage(receiver,  sender, text)
        } 
        else if ( receiver.type === 'bot.reverse' ) {
            return await BotService.waitForThreeSec(
                await this.messageService.saveMessage(receiver, sender, text.split("").reverse().join(""))
            );
        }
    }

    track(sender: any, receiver: Users): Subject<Message> {
        
        const message = new Subject<Message>();

        if( receiver.type === 'bot.spam' ) {
            const max = 120000; // 120000
            const min = 10000; // 10000
            const sendMsg = async () => { 
                message.next(await this.messageService.saveMessage(receiver,  sender, lorem.text() )) 
            }

            const loop = () => {
                const rand = Math.round(Math.random() * (max - min)) + min;
                this.timer = setTimeout(function() {
                        sendMsg();
                        loop();  
                }, rand);
            }
            loop();
        }
        
        return message;
    }
    
    untrack() {
        if ( this.timer ) {
            clearTimeout(this.timer);
        }
    }

    static waitForThreeSec<T>(val: T): Promise<T> {
        const promise = new Promise<T>(function(resolve, reject) {
          setTimeout(async () => {
            resolve(val);
          }, 3000);
        });
        return promise;
    }
}
