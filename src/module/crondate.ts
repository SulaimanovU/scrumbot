
export default class CronDate {

    getTimeStr(): string {
        const date = new Date();
        const hour = date.getUTCHours() + 6;
        const min = date.getUTCMinutes();
        const sec = date.getSeconds();

        return `${hour}:${min}:${sec}`;
    }

    getDateStr(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthDay = date.getDate();

        return `${year}-${month}-${monthDay}`;
    }

    getPrevDateStr(): string {
        const date = this.getPrevDayDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthDay = date.getDate();

        return `${year}-${month}-${monthDay}`;
    }

    getPrevDayDate(date = new Date()): Date {
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() - 1);
      
        return previous;
    }

    getKgDate(): Date {
        const date = new Date();
        const hour = date.getUTCHours() + 6;
        const min = date.getUTCMinutes();
        const sec = date.getSeconds();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return new Date(year, month, day, hour, min, sec);
    }

}
