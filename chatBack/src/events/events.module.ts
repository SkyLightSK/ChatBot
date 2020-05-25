import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessageModule } from 'src/message/message.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:  [MessageModule, UsersModule],
  providers: [EventsGateway],
})
export class EventsModule {}
