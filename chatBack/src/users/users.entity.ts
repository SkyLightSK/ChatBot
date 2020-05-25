import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Message } from 'src/message/message.entity';

@Entity()
export class Users {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', default: ''})
  name?: string;

  @Column({type: 'varchar', default: ''})
  avatar?: string;

  @Column({type: 'varchar', default: ''})
  description?: string;

  @Column({type: 'varchar'})
  type?: string;

  @Column()
  @CreateDateColumn()
  createdAt?: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(type => Message, message => message.receiver)
  receiveMessages: Message[];

  @OneToMany(type => Message, message => message.sender)
  sendMessages: Message[];

}
