import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ChangeBossDto } from "./dto/change-bos.dto";

@Injectable()
export class UsersService extends TypeOrmCrudService<User>{
    private readonly salt: string;
    private jwtService: JwtService;

    constructor(@InjectRepository(User) usersRepository: Repository<User>){
        super(usersRepository);
        this.salt = bcrypt.genSaltSync(10);
    }
    async checkPassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return await bcrypt.compare(password, hash);
    }

    async createUser(user: CreateUserDto): Promise<User> {
        const newUser = new User();
        return this.repo.save({ ...newUser, ...user });
    }
    async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
        this.jwtService = new JwtService({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60s' }
        })

        const { email, password } = loginUserDto;
        const user = await this.repo.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('User does not exist');
        }

        if (!(await this.checkPassword(password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload);
        return { token };
    }

    async getListOfUsers(): Promise<User[]> {
        let users: User[] = [];
        users = await this.repo.find();
        return users;
    }
    async getAllUsers(id): Promise<User[]> {
        const user = await this.getUserById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        let users: User[] = [];

        if (user.role === UserRole.ADMIN) {
            users = await this.repo.find();
        } else if (user.role === UserRole.BOSS) {
            users = await this.getSubordinates(user.id);
        } else {
            users = [user];
        }

        return users;
    }
    async getSubordinates(userId: number, processedUserIds: number[] = [], depth = 0, maxDepth = 10): Promise<User[]> {
        const user = await this.getUserById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (depth > maxDepth) {
            return [];
        }

        if (user.role === UserRole.REGULAR) {
            return [user];
        }

        const subordinates = await this.repo.find({
            where: { boss: user }
        });

        const recursiveSubordinates = await Promise.all(
          subordinates.map((subordinate) => {
              if (processedUserIds.includes(subordinate.id)) {
                  return [];
              } else {
                  const updatedProcessedUserIds = [...processedUserIds, subordinate.id];
                  return this.getSubordinates(subordinate.id, updatedProcessedUserIds, depth + 1, maxDepth);
              }
          })
        );

        return [user, ...recursiveSubordinates.flat()];
    }

    private async getUserById(id: number): Promise<User> {
        return this.repo.findOneBy({ id });
    }
    async changeBoss(id: number, changeBossDto: ChangeBossDto): Promise<User> {
        const { bossId } = changeBossDto;
        const subordinate = await this.repo.findOneBy({ id });
        if (!subordinate) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        if (bossId === subordinate.id) {
            throw new ConflictException(`User can't be their own boss`);
        }
        const boss = await this.repo.findOne({ where: { id: bossId } });

        if (!boss || boss.role !== UserRole.BOSS || boss.id === subordinate.bossId) {
            throw new NotFoundException(`Invalid boss`);
        }
        subordinate.boss = boss;
        await this.repo.save(subordinate);
        return subordinate;
    }
}