import { UserRole } from "../entities/users.entity";

export class LoginUserDto {
    email: string;
    password: string;
    role: UserRole;
}