import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Report, GroupTg } from "./entities";

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    member_id: number

    @Column({default: 'albedo'})
    name: string

    @Column({default: 'rubedo'})
    username: string

    @Column()
    position: string

    @Column({type: 'timestamp'})
    created_at: Date;

    @ManyToOne(() => GroupTg, (group_tg) => group_tg.members, { onDelete: 'CASCADE' })
    group_tg: GroupTg

    @OneToMany(() => Report, (report) => report.member, { onDelete: 'CASCADE' })
    reports: Report[]
}