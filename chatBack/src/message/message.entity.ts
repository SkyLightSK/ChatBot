import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { Users } from 'src/users/users.entity';

@Entity()
export class Message {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', default: ''})
  text?: string;

  @Column()
  @CreateDateColumn()
  createdAt?: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne( type => Users, user => user.receiveMessages )
  receiver: Users;

  @ManyToOne( type => Users, user => user.sendMessages )
  sender: Users;

}
