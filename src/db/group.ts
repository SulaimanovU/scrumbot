import { Entity, Column, OneToMany, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./entities";

@Entity()
export class GroupTg {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'bigint'})
    group_id: number

    @Column()
    name: string

    @Column({default: false})
    report_on: boolean

    @Column({default: false})
    retro_on: boolean

    @Column({default: false})
    feedback_on: boolean

    @Column({default: false})
    mock_interview_on: boolean

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Member, (member) => member.group_tg, { onDelete: 'CASCADE' })
    members: Member[]
}