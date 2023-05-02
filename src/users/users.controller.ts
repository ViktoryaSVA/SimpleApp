import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { Crud } from '@nestjsx/crud';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ChangeBossDto } from "./dto/change-bos.dto";

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

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
        return this.usersService.login(loginUserDto);
    }
    @Get(':id/subordinates')
    async findSubordinates(@Param('id') id: number): Promise<User[]> {
        return this.usersService.getSubordinates(id);
    }
    @Get(':id')
    async getAllUsers(@Param('id') id: number): Promise<User[]> {
        return this.usersService.getAllUsers(id);
    }
    @Get('list')
    async getListOfUsers(): Promise<User[]> {
        return this.usersService.getListOfUsers();
    }

    @Patch(':id/change-boss')
    async changeBoss(
        @Param('id', ParseIntPipe) id: number,
        @Body() changeBossDto: ChangeBossDto
    ): Promise<User> {
        return this.usersService.changeBoss(id, changeBossDto);
    }
}