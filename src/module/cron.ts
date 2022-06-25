import TelegramBot from 'node-telegram-bot-api';
import { DataSource, EntityManager } from "typeorm";
import { CronJob } from 'cron';
import DataSourceConnect from '../db/datasource';
import { telegram } from '../config';
import CronDate from './crondate';

export default class JobHandler {
    cronJobs: Map<string, CronJob> = new Map<string, CronJob>();

    dataSource: DataSource;
    manager: EntityManager;
    bot: TelegramBot;
    cronDate: CronDate;

    constructor() {
        this.dataSource = DataSourceConnect.getConnection();
        this.manager = this.dataSource.manager;
        this.bot = new TelegramBot(telegram.token);
        this.cronDate = new CronDate();
    }

    reportCronJob(time: string, group_id: number): CronJob {
        let manager = this.manager;
        let cronDate = this.cronDate;
        let bot = this.bot;

        const job = new CronJob(time, async function() {
            let rawSql = `
                select * from member
                where id not in (
                    select member.id from member
                    left join report r on member.id = r.member_id
                    left join group_tg gt on member.group_tg_id = gt.id
                    where gt.group_id = ${group_id} and
                        r.created_at < timestamp '${cronDate.getDateStr()} 11:00:00' and
                        r.created_at > timestamp '${cronDate.getPrevDateStr()} 11:00:00'
                );
            `;
            
            let members: [{name: string}] = await manager.query(rawSql);
            let msgString :string = '';

            members.forEach(member => {
                msgString = msgString + `${member.name}\n`;
            });

            msgString = msgString + 'Failed to post a report up to date!';

            await bot.sendMessage(group_id, msgString);
        })

        job.start();

        return job;
    }
}
