import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Report } from "./entities";

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    member_id: number

    @Column()
    group_id: number

    @Column()
    name: string

    @Column()
    username: string

    @Column()
    position: string

    @OneToMany(() => Report, (report) => report.member)
    reports: Report[]
}