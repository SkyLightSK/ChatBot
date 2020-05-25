import { Controller, HttpException, HttpStatus, Req, Get, Query } from '@nestjs/common';
import { CommonResult } from 'src/models/common-result';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    
    constructor(private readonly messageService: MessageService) {}

    @Get()
    async getByParticipants(@Query('participant1') participant1, @Query('participant2') participant2): Promise<Message[]> {
      try {
        return await this.messageService.getParticipantsMsgs(participant1, participant2);
      } catch (err) {
        throw new HttpException(new CommonResult(false, 'Server error'), HttpStatus.BAD_REQUEST);
      }
    }
}
