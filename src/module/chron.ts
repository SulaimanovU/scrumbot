
interface EventTimer {
    eventHour: number;
    eventMinute: number;
}

export default class Chronos {
    private leaveWeekend: boolean;
    private time: EventTimer;
    private hourInMili = 3600000;
    private MinInMili = 60000;

    constructor(time: EventTimer, leaveWeekend: boolean) {
        this.leaveWeekend = leaveWeekend;
        this.time = time;
    }

    calcTimerWithArguments(time: EventTimer): number {
        const date = new Date();
        const systemHour = date.getUTCHours() + 6;
        const systemMinute = date.getUTCMinutes();
        const { eventHour, eventMinute } = time;
        let hour: number, minut: number;

        if(systemHour <= eventHour) {
            hour = eventHour - systemHour;
        }
        else {
            hour = (24 - systemHour) + eventHour;
        }
        
        if(eventMinute > systemMinute) {
            minut = eventMinute - systemMinute;
        }
        else {
            minut = 60 - (systemMinute - eventMinute);
            hour--;
        }

        if(systemHour === eventHour && systemMinute === eventMinute) {
            hour = 24;
            minut = 0;
        }

        console.log(`h: ${hour}, m: ${minut}`)
        
        let timerTime = ((hour * this.hourInMili) + (minut * this.MinInMili));
        return timerTime;
    }

    calcTimer(): number {
        return this.calcTimerWithArguments(this.time);
    }

    static getDbTime(): string {
        const date = new Date();
        const hour = date.getUTCHours() + 6;
        const min = date.getUTCMinutes();
        const sec = date.getSeconds();

        return `${hour}:${min}:${sec}`;
    }

    static getDbDate(): string {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }

    static getPrevDbDate(): string {
        const date = this.getPreviousDay();
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }

    static getPreviousDay(date = new Date()) {
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() - 1);
      
        return previous;
    }

    static initDate(): Date {
        const date = new Date();
        const hour = date.getUTCHours() + 6;
        const min = date.getUTCMinutes();
        const sec = date.getSeconds();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return new Date(year, month, day, hour, min, sec);
    }

    static getTimeStamp(): string {
        return `${this.getDbDate()} ${this.getDbTime()}`;
    }

    async startLoop(callback, args) {
        let timerTime: number;
        let date = new Date();
        let fridayNum = 4;
 
        timerTime = this.calcTimer();


        if(this.leaveWeekend && date.getDay() === fridayNum) {
            timerTime += 48 * this.hourInMili;
        }
        
        console.log(`timerTime: ${timerTime}`)

        let loopPromise = new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await callback(args);
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
                
            }, timerTime)
        })
        
        await loopPromise
        this.startLoop(callback, args);
    }
}
