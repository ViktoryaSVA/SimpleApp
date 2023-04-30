import {Body, Controller, Post} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import {CreateUserDto} from "./dto/create-user.dto";

@Crud({
    model: {
        type: User
    }
})
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }
}