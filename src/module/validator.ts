import { Message } from 'node-telegram-bot-api';

export default class ValidateMessage {    

    validate(msg: Message): string {
        if(this.isNewMemberEvent(msg)) return 'new_member_event';
        else if(this.isLeaveMemberEvent(msg)) return 'leave_member_event';
        else if(this.isNewMemberCmd(msg)) return 'new_member_cmd';
        else if(this.isTeamListCmd(msg)) return 'team_list_cmd';
        else if(this.isReportCmd(msg)) return 'post_report_cmd';
        else if(this.isReportOnCmd(msg)) return 'report_on_cmd';
        else if(this.isReportOffCmd(msg)) return 'report_off_cmd';
        else if(this.isScrumInitCmd(msg)) return 'scrum_init_cmd';
        else if(this.isScrumDisableCmd(msg)) return 'scrum_disable_cmd';
        else return 'do_nothing';
    }

    isNewMemberEvent(msg: Message): boolean {
        if(msg.new_chat_members !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    
    isLeaveMemberEvent(msg: Message): boolean {
        if(msg.left_chat_member !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    
    isTextMessage(msg: Message): boolean {
        if(msg.text !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    
    isTeamListCmd(msg: Message): boolean {
        if(this.isTextMessage(msg)) {
            if(msg.text.toLowerCase() === '#teamlist') {
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
    
    isReportCmd(msg: Message): boolean {
        if(this.isTextMessage(msg)) {
            let [str] = msg.text.split('\n');

            if(str.trim() === '#report') {
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

    isNewMemberCmd(msg: Message): boolean {
        if(this.isTextMessage(msg)) {
            if(msg.text.toLowerCase() === '#newmember') {
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

    isReportOnCmd(msg: Message): boolean {
        if(this.isTextMessage(msg)) {
            let [str] = msg.text.split(' ');
            if(str === '#reporton') {
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

    isReportOffCmd(msg: Message): boolean {
        if(this.isTextMessage(msg)) {
            if(msg.text.toLowerCase() === '#reportoff') {
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

    isScrumInitCmd(msg: Message): boolean {
        if(this.isTextMessage(msg)) {
            if(msg.text.toLowerCase() === '#scruminit') {
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

    isScrumDisableCmd(msg: Message): boolean {
        if(this.isTextMessage(msg)) {
            if(msg.text.toLowerCase() === '#scrumdisable') {
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
}