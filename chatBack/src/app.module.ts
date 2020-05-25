import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import * as ormconfig from './ormconfig';

@Module({
  imports: [
    EventsModule, 
    UsersModule,
    MessageModule,
    TypeOrmModule.forRoot( ormconfig ),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
