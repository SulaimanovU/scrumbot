import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { TgUser, Report } from "./entities";

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    is_active: string

    @Column({type: 'timestamp'})
    created_at: Date

    @OneToOne(() => TgUser, (tg_user) => tg_user.member, { onDelete: 'CASCADE' })
    tg_user: TgUser

    @OneToMany(() => Report, (report) => report.member, { onDelete: 'CASCADE' })
    reports: Report[]
}