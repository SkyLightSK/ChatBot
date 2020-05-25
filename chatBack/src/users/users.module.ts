import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { BotService } from './bot/bot.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MessageModule],
  controllers: [UsersController],
  providers: [UsersService, BotService],
  exports: [UsersService, BotService]
})
export class UsersModule {}
