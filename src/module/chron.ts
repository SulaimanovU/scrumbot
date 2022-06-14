
interface EventTimer {
    eventHour: number;
    eventMinute: number;
}

export default class Chronos {
    private status = false;
    private weekend: boolean;
    private time: EventTimer;
    private hourInMili = 3600000;
    private MinInMili = 60000;

    constructor(weekend, time) {
        this.weekend = weekend;
        this.time = time;
    }

    calcTimer(time: EventTimer) {
        const date = new Date();
        const systemHour = date.getUTCHours() + 6;
        const systemMinute = date.getUTCMinutes();
        const { eventHour, eventMinute } = time;
        let hour: number, minut: number;

        if(systemHour < eventHour) {
            hour = eventHour - systemHour;
        }
        else {
            hour = (24 - systemHour) + eventHour;
        }
        
        if(eventMinute > systemMinute) {
            minut = eventMinute - systemMinute;
        }
        else {
            minut = 60 - (systemMinute - eventMinute)
            hour--;
        }
        
        let timerTime = ((hour * this.hourInMili) + (minut * this.MinInMili));
        return timerTime;
    }

    async startLoop(callback, args) {
        let timerTime: number;
        let date = new Date();
        let fridayNum = 4;
 
        if(this.status) {
            timerTime = this.calcTimer(this.time);
            this.status = true;
        }
        else {
            timerTime = 24 * this.hourInMili;
        }

        if(this.weekend && date.getDay() === fridayNum) {
            timerTime += 48 * this.hourInMili;
        }
        
        let loopPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                callback(args);
                resolve(true);
            }, timerTime)
        })
        
        await loopPromise
        this.startLoop(callback, args);
    }
}



