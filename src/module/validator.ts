import { Message } from 'node-telegram-bot-api';

export default class ValidateMessage {    

    validate(msg: Message): string {
        if(this.isNewMember(msg)) return 'new_member';
        else if(this.isLeaveMember(msg)) return 'leave_member';
        else if(this.isTeamList(msg)) return 'team_list';
        else if(this.isReport(msg)) return 'post_report';
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
    
    isTeamList(msg: Message): boolean {
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
    
    isReport(msg: Message): boolean {
        if(this.isTextMessage(msg)) {
            if(msg.text.toLowerCase().search('#report') === 0) {
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