import TelegramBot, { Message } from 'node-telegram-bot-api';
import { DataSource, EntityManager } from "typeorm";
import { Member, Report } from '../db/entities';
import ValidateMessage from './validator';
import Chronos from './chron';

export default class CommandHandler {
    private bot: TelegramBot;
    private validator: ValidateMessage;
    private db: DataSource;
    private manager: EntityManager
    private chrons: [Chronos];

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
            let member = this.manager.create(Member, {
                member_id: member_id,
                group_id: group_id,
                name: first_name,
                username: username,
                position: 'not defined',
                created_at: Chronos.initDate()
            })

            await this.manager.save(member);
        }
        else {
            await this.bot.sendMessage(group_id, 'Status: Member already exist!')
            return false;
        }

        await this.bot.sendMessage(group_id, 'Status: New member saved!')
        return true;
    }

    async report_on_cmd(msg: Message) {
        let chron = new Chronos({
            eventHour: 19,
            eventMinute: 2
        }, true)

        chron.startLoop(
            async ({bot, manager, msg}) => {
                const { chat: { id: group_id } } = msg;
                let result = await manager.query(`
                    select * from member
                    left join report r on member.id = r.member_id
                    where group_id = ${group_id} and 
                    r.created_at < timestamp '${Chronos.getDbDate()} 11:00:00' and
                    r.created_at > timestamp '${Chronos.getPrevDbDate()} 11:00:00';
                `)

                console.log(result);

                await bot.sendMessage(group_id, 'Status: Alarm!')
            }, 
            {bot: this.bot, manager: this.manager, msg: msg}
        )
    }

    async new_member_cmd(msg: Message) {
        const { from: {id: member_id, first_name, username} } = msg;
        const { chat: { id: group_id } } = msg;


        const member = await this.manager.findOne(Member, {
            where: {
                member_id: member_id,
                group_id: group_id
            }
        })

        if(member === null) {
            let member = this.manager.create(Member, {
                member_id: member_id,
                group_id: group_id,
                name: first_name,
                username: username,
                position: 'not defined',
                created_at: Chronos.initDate()
            })

            await this.manager.save(member);
        }
        else {
            await this.bot.sendMessage(group_id, 'Status: Member already exist!');
            return false;
        }

        await this.bot.sendMessage(group_id, 'Status: New member saved!');
        return true;
    }

    async post_report_cmd(msg: Message){
        const { from: { id: member_id }, chat: { id: group_id }, text } = msg;

        let member = await this.manager.findOne(Member, {
            where: {
                member_id: member_id,
                group_id: group_id
            }
        });

        if(member === null) {
            await this.bot.sendMessage(group_id, 'Status: You are not registered!');
            return false;
        }
        
        let report = this.manager.create(Report, {
            report: text,
            created_at: Chronos.initDate(),
            member: member
        })

        await this.manager.save(report);
            
        await this.bot.sendMessage(group_id, 'Status: Report saved!')

        return true;
    }

    async team_list_cmd(msg: Message) {
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

    do_nothing() {
        console.log('did nothing')
    }


}