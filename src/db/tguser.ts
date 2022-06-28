import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from "typeorm";
import { GroupTg, Member } from "./entities";

@Entity()
export class TgUser {
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
    created_at: Date

    @ManyToOne(() => GroupTg, (group_tg) => group_tg.members, { onDelete: 'CASCADE' })
    group_tg: GroupTg

    @OneToOne(() => Member, (member) => member.tg_user, { onDelete: 'CASCADE' })
    member: Member
}