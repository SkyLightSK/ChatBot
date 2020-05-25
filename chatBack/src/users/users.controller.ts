import { Controller, Req, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { CommonResult } from 'src/models/common-result';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers(@Req() request): Promise<Users[]> {
      try {
        return await this.usersService.findAllUsers();
      } catch (err) {
        throw new HttpException(new CommonResult(false, 'Server error'), HttpStatus.BAD_REQUEST);
      }
    }

    @Get('create')
    async createUser(): Promise<Users> {
        try {
            return await this.usersService.createUser();
        } catch (err) {
            throw new HttpException(new CommonResult(false, 'Server error'), HttpStatus.BAD_REQUEST);
        }
    }
}
