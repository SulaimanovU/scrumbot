import { Message } from 'node-telegram-bot-api';

export default class ValidateMessage {    

    validate(msg: Message): string {
        if(this.isNewMember(msg)) return 'new_member';
        else if(this.isLeaveMember(msg)) return 'leave_member';
        else if(this.isNewMemberCmd(msg)) return 'new_member_cmd';
        else if(this.isTeamListCmd(msg)) return 'team_list_cmd';
        else if(this.isReportCmd(msg)) return 'post_report_cmd';
        else if(this.isReportOnCmd(msg)) return 'report_on_cmd';
        else return 'do_nothing';
    }

    isNewMember(msg: Message): boolean {
        if(msg.new_chat_members !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    
    isLeaveMember(msg: Message): boolean {
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
            if(msg.text.toLowerCase().slice(0, 7) === '#report') {
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
            if(msg.text.toLowerCase() === '#setallarm') {
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