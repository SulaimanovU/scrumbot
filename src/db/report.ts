import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Member } from "./entities"

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    report: string

    @ManyToOne(() => Member, (member) => member.reports)
    member: Member
}