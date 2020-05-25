import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { internet, image } from 'faker';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    ) {  }

    async findAllUsers(): Promise<Users[]> {
        return await this.userRepository.find();
    }
    
    async createUser(): Promise<Users> {
        return await this.userRepository.save({name: internet.userName(), avatar: image.avatar(), type: 'client'});;
    }

}
