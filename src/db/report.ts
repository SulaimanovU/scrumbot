import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Member } from "./entities"

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    report: string

    @Column({type: 'timestamp'})
    created_at: Date;

    @ManyToOne(() => Member, (member) => member.reports, { onDelete: 'CASCADE' })
    member: Member
}