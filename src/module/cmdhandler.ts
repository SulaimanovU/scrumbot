import TelegramBot, { Message } from 'node-telegram-bot-api';
import { DataSource, EntityManager } from "typeorm";
import DataSourceConnect from '../db/datasource';
import { Member, Report, GroupTg, TgUser } from '../db/entities';
import ValidateMessage from './validator';
import { telegram } from '../config';
import CronDate from './crondate';
import JobHandler from './cron';



export default class CommandHandler {
    private bot: TelegramBot;
    private validator: ValidateMessage;
    private dataSource: DataSource;
    private manager: EntityManager;
    private cronDate: CronDate;
    private jobHandler: JobHandler;

    constructor() {
        this.bot = new TelegramBot(telegram.token);
        this.validator = new ValidateMessage();
        this.dataSource = DataSourceConnect.getConnection();
        this.manager = this.dataSource.manager;
        this.cronDate = new CronDate();
        this.jobHandler = new JobHandler();
    }   

    async start(msg: Message) {
        let command = this.validator.validate(msg);
        await this[command](msg);
    }

    async new_member_event(msg: Message) {
        const { id: member_id, first_name, username, is_bot } = msg.new_chat_members[0];
        const { chat: { id: group_id } } = msg;
        try {
            if(is_bot && first_name === 'Solid-Scrum.Bot') {
                await this.scrum_init_cmd(msg);
                return false;
            }
            else if(is_bot){
                return false;
            }

            const group = await this.manager.findOne(GroupTg, {
                where: {
                    group_id: group_id
                }
            })

            if(group === null) {
                await this.bot.sendMessage(group_id, 'Status: Group is not registered!')
                return false;
            }

            const member = await this.manager.findOne(TgUser, {
                where: {
                    member_id: member_id
                }
            })

            if(member === null) {
                let member = this.manager.create(TgUser, {
                    member_id: member_id,
                    group_tg: group,
                    name: first_name,
                    username: username,
                    position: 'not defined',
                    created_at: this.cronDate.getKgDate()
                })

                await this.manager.save(member);
            }
            else {
                return false;
            }

            await this.bot.sendMessage(group_id, 'Status: New member saved!')
            return true;
        } catch (error) {
            await this.bot.sendMessage(group_id, 'Status: Error!')
            return false;
        }
    }

    async leave_member_event(msg: Message) {
        return 'Not Implemented';
    }

    async new_member_cmd(msg: Message) {
        const { from: {id: member_id, first_name, username} } = msg;
        const { chat: { id: group_id } } = msg;

        try {
            const group = await this.manager.findOne(GroupTg, {
                where: {
                    group_id: group_id
                }
            })

            if(group === null) {
                await this.bot.sendMessage(group_id, 'Status: Group is not registered!')
                return false;
            }

            const member = await this.manager.findOne(TgUser, {
                where: {
                    member_id: member_id
                }
            })

            if(member === null) {
                let member = this.manager.create(TgUser, {
                    member_id: member_id,
                    group_tg: group,
                    name: first_name,
                    username: username,
                    position: 'not defined',
                    created_at: this.cronDate.getKgDate()
                })

                await this.manager.save(member);
            }
            else {
                return false;
            }

            await this.bot.sendMessage(group_id, 'Status: New member saved!')
            return true;
        } catch (error) {
            await this.bot.sendMessage(group_id, 'Status: Error!')
            return false;
        }
    }

    async post_report_cmd(msg: Message) {
        const { from: { id: member_id }, chat: { id: group_id }, text } = msg;

        try {
            let member = await this.manager.findOne(TgUser, {
                where: {
                    member_id: member_id
                }
            });
    
            if(member === null) {
                await this.bot.sendMessage(group_id, 'Status: You are not registered!');
                return false;
            }

            if(member.group_tg.group_id !== group_id) {
                await this.bot.sendMessage(group_id, 'Status: You are not belong to this group!');
                return false;
            }
            
            let report = this.manager.create(Report, {
                report: text,
                created_at: this.cronDate.getKgDate(),
                member: member
            })
    
            await this.manager.save(report);
                
            await this.bot.sendMessage(group_id, 'Status: Report saved!')
    
            return true;
        } catch (error) {
            await this.bot.sendMessage(group_id, 'Status: Error!')
            return false;
        }
        
    }

    async team_list_cmd(msg: Message) {
        const { chat: { id: group_id } } = msg;

        try {
            const group = await this.manager.findOne(GroupTg, {
                where: {
                    group_id: group_id
                }
            })

            if(group === null) {
                await this.bot.sendMessage(group_id, 'Status: Group is not registered!')
                return false;
            }

            const { members } = await this.manager.findOne(GroupTg, {
                relations: {
                    members: true
                },
                where: {
                    group_id: group_id
                }
            })
    
            let teamMembers = members.map((data) => {
                return `name: ${data.name}\nposition: ${data.position}`;
            });
    
            if(members.length > 0) {
                this.bot.sendMessage(group_id, teamMembers.join('\n'))
            }
            else {
                this.bot.sendMessage(group_id, 'Status: No members found!')
            }
        } catch (error) {
            this.bot.sendMessage(group_id, 'Status: Error!');
            return false;
        }
        
    }

    async report_on_cmd(msg: Message) {
        const { chat: { id: group_id }, text } = msg;
        try {
            const group = await this.manager.findOne(GroupTg, {
                where: {
                    group_id: group_id
                }
            })

            if(group === null) {
                await this.bot.sendMessage(group_id, 'Status: Group is not registered!')
                return false;
            }

            let time = text.replace('#reporton', '').trim();
            let cronJob = this.jobHandler.cronJobs.get(String(group_id));

            if(cronJob !== undefined) {
                cronJob.stop();
            }

            cronJob = this.jobHandler.reportCronJob(time, group_id);
            this.jobHandler.cronJobs.set(String(group_id), cronJob);

            await this.bot.sendMessage(group_id, 'Status: Report check is on!');
            return true;
        } catch (error) {
            await this.bot.sendMessage(group_id, 'Status: Error!');
            return false;
        }
    }

    async report_off_cmd(msg: Message) {
        const { chat: { id: group_id } } = msg;
        try {
            const cronJob = this.jobHandler.cronJobs.get(String(group_id));

            if(!cronJob) {
                await this.bot.sendMessage(group_id, 'Status: There is no any Report check!');
            }
            cronJob.stop();
            this.jobHandler.cronJobs.delete(String(group_id));

            await this.bot.sendMessage(group_id, 'Status: Report check is off!');
            return true;
        } catch (error) {
            await this.bot.sendMessage(group_id, 'Status: Error!');
            return false;
        }
    }

    async scrum_init_cmd(msg: Message) {
        const { chat: { id: group_id, title } } = msg;
        try {
            let group = await this.manager.findOne(GroupTg, {
                where: {
                    group_id: group_id
                }
            });

            if(group !== null) {
                await this.bot.sendMessage(group_id, 'Status: ScrumBot is running!');
                return false;
            }

            group = this.manager.create(GroupTg, {
                group_id: group_id,
                name: title,
                created_at: this.cronDate.getKgDate()
            })

            await this.manager.save(group);
                
            await this.bot.sendMessage(group_id, 'Status: ScrumBot is running!')

            return true;
        } catch (error) {
            console.log(error);
            await this.bot.sendMessage(group_id, 'Status: Error!');
            return false;
        }
    }

    async scrum_disable_cmd(msg: Message) {
        const { chat: { id: group_id } } = msg;
        try {
            let group = await this.manager.findOne(GroupTg, {
                where: {
                    group_id: group_id
                }
            });

            if(group === null) {
                await this.bot.sendMessage(group_id, 'Status: Group is not registered!');
                return false;
            }

            await this.manager.remove(group);
            let cronJob = this.jobHandler.cronJobs.get(String(group_id));

            if(cronJob) {
                cronJob.stop();
            }
            
            this.jobHandler.cronJobs.delete(String(group_id));
                
            await this.bot.sendMessage(group_id, 'Status: Srum bot disabled!')

            return true;
        } catch (error) {
            console.log(error);
            await this.bot.sendMessage(group_id, 'Status: Error!');
            return false;
        }
    }

    // MUST REFACTOR
    do_nothing() {
        console.log('did nothing')
    }

}