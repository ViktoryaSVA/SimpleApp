import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UsersService extends TypeOrmCrudService<User>{
    constructor(@InjectRepository(User) usersRepository: Repository<User>){
        super(usersRepository);
    }

    async createUser(user: CreateUserDto): Promise<User> {
        const newUser = new User();
        newUser.email = user.email;
        newUser.username = user.username;
        newUser.password = user.password;
        return this.repo.save(newUser);
    }
}