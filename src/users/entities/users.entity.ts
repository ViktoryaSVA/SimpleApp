import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
export enum UserRole {
    ADMIN = 'admin',
    BOSS = 'boss',
    REGULAR = 'regular',
}
@Entity()
export class User {
    @PrimaryGeneratedColumn('identity', {
        generatedIdentity: 'ALWAYS'
    })
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    role: UserRole;

    @Column({ nullable: true })
    bossId?: number;

    @ManyToOne(() => User, { nullable: true })
    boss: User;

    @OneToMany(() => User, user => user.boss)
    subordinates: User[];
}