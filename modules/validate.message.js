export default class ValidateMessage {
    
    constructor(bot, db, chronos) {
        this.bot = bot;
        this.db = db;
        this.chronos = chronos;
    }

   async start(msg) {
        if(this.isNewMember(msg)){
            console.log(await this.saveMember(msg));
        }
        else if(this.isLeaveMember(msg)) {
            console.log('left_chat_member')
        }
        else if(this.isTeamList(msg)) {
            console.log(await this.sendTeamList(msg));
        }
        else if(this.isReport(msg)) {
            console.log(await this.saveReport(msg));
        }
        else if(this.isAllarm(msg)) {
            console.log('is allarm works')
            console.log(await this.setReportAllarm(msg));
        }
        else {
            console.log(await this.sendWarnDummyMessage(msg));
        }
    }

    // IS METHODS
    isNewMember(msg) {
        if(msg.new_chat_member) {
            return true;
        }
        else {
            return false;
        }
    }

    isLeaveMember(msg) {
        if(msg.left_chat_member) {
            return true;
        }
        else {
            return false;
        }
    }

    isTextMessage(msg) {
        if(msg.text) {
            return true;
        }
        else {
            return false;
        }
    }

    isTeamList(msg) {
        if(this.isTextMessage(msg)) {
            if(msg.text.toLowerCase() === 'teamlist') {
                return true;
            }
            else {
                return false
            }
        }
        else {
            return false;
        }
    }

    isReport(msg) {
        if(this.isTextMessage(msg)) {
            if(msg.text.trim().toLowerCase().search('report:') === 0) {
                return true;
            }
            else if(msg.text.trim().toLowerCase().search('report') === 0) {
                return true;
            }
            else {
                return false
            }
        }
        else {
            return false;
        }
    }

    isAllarm(msg) {
        if(this.isTextMessage(msg)) {
            if(msg.text.trim().toLowerCase().search('setup:') === 0) {
                return true;
            }
            else if(msg.text.trim().toLowerCase().search('setup') === 0) {
                return true;
            }
            else {
                return false
            }
        }
        else {
            return false;
        }
    }

    // SAVE METHODS
    async saveReport(msg) {
        try {
            let member = await this.db.Member.findOne({
                telegramId: msg.from.id,
                group_id: msg.chat.id
            })
            await member.createReport({
                report: msg.text
            })
            return 'report saved';
        } catch (error) {
            return 'error with report saving';
        }
        
    }

    async saveMember(msg) {
        const { new_chat_member: { id, first_name, username }, chat: { id: group_id } } = msg;

        const existedMember = await this.db.Member.findAll({
            where: {
                telegram_id: id,
                group_id: group_id
            }
        })

        if(existedMember.length > 0) {
            return 'Member already exist';
        }
        else {
            await this.db.Member.create({
                telegram_id: id,
                group_id: group_id,
                name: first_name,
                username: username,
                position: 'not defined'
            })
        }

        return 'New member added';
    }

    // SEND METHODS
    async sendTeamList(msg) {
        const { chat: { id: group_id } } = msg;

        const existedMember = await this.db.Member.findAll({
            where: {
                group_id: group_id
            }
        })

        let teamMembers = existedMember.map(({dataValues}) => {
            return `name: ${dataValues.name}\nposition: ${dataValues.position}`;
        });

        if(existedMember) {
            this.bot.sendMessage(group_id, teamMembers.join('\n'))
        }
        else {
            this.bot.sendMessage(group_id, 'no members found')
        }

        return 'list of members returned';
    }

    sendWarnDummyMessage(msg) {
        this.bot.deleteMessage(msg.chat.id, msg.message_id);
        this.bot.sendMessage(msg.chat.id, 'Here you can send only message which start with (report:) or bot commands')
        return 'users warned about dummy message';
    }

    // SET METHODS
    async setReportAllarm(msg) {
        await this.chronos.startLoop({hour: 19, minut: 25}, ({bot, db, msg}) => {
            bot.sendMessage(msg.chat.id, 'Do not forget to post your daily reports, you litle piece of bull SHIT')
        }, {bot: this.bot, db: this.db, msg: msg}, true)

        return 'allarm setup'
    }
}