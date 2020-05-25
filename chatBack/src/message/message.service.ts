import { Injectable } from '@nestjs/common';
import { Repository, Raw, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Users } from 'src/users/users.entity';

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    ) {  }


    async saveMessage(sender: Users, receiver: Users, text: string): Promise<Message> {
        return await this.messageRepository.save({text, receiver, sender})   
    }

    async getParticipantsMsgs( participant1: number, participant2: number ) : Promise<Message[]> {
        return await this.messageRepository.find({
            where : {
                receiver:   In([participant1, participant2]),
                sender:     In([participant1, participant2]),
            },
            relations: ['receiver', 'sender']
        })
        
    }

}
