import TelegramBot, { Message } from 'node-telegram-bot-api';
import ValidateMessage from './validator';
import { DataSource, EntityManager } from "typeorm";
import { Member, Report } from '../db/entities';

export default class CommandHandler {
    private bot: TelegramBot;
    private validator: ValidateMessage;
    private db: DataSource;
    private manager: EntityManager

    constructor(bot: TelegramBot, db: DataSource) {
        this.bot = bot;
        this.validator = new ValidateMessage();
        this.db = db;
        this.manager = this.db.manager;
    }   

    async start(msg: Message) {
        let command = this.validator.validate(msg);
        await this[command](msg);
    }


    async new_member(msg: Message) {
        const { id: member_id, first_name, username } = msg.new_chat_members[0];
        const { chat: { id: group_id } } = msg;


        const member = await this.manager.findOne(Member, {
            where: {
                member_id: member_id,
                group_id: group_id
            }
        })

        if(member === null) {
            await this.manager.create(Member, {
                member_id: member_id,
                group_id: group_id,
                name: first_name,
                username: username,
                position: 'not defined'
            })
        }

        await this.bot.sendMessage(group_id, 'Status: New member saved!')
    }

    async post_report(msg: Message) {
        const { from: { id: member_id }, chat: { id: group_id }, text } = msg;

        let member = await this.manager.findOne(Member, {
            where: {
                member_id: member_id,
                group_id: group_id
            }
        });

        this.manager.create(Report, {
            report: text,
            member: member
        })
            
        await this.bot.sendMessage(group_id, 'Status: Report saved!')
    }

    async team_list(msg: Message) {
        const { chat: { id: group_id } } = msg;

        const members = await this.manager.find(Member)

        let teamMembers = members.map((data) => {
            return `name: ${data.name}\nposition: ${data.position}`;
        });

        if(members.length > 0) {
            this.bot.sendMessage(group_id, teamMembers.join('\n'))
        }
        else {
            this.bot.sendMessage(group_id, 'Status: No members found!')
        }
    }



}