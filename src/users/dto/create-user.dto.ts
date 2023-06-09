import { UserRole } from "../entities/users.entity";

export class CreateUserDto {
    email: string;
    username: string;
    password: string;
    role: UserRole;
    bossId?: number;
}