
export default class Chronos {
    chronStatus;

    calcTime(time) {
        let date = new Date();
        let hour = date.getUTCHours() + 6;
        let minut = date.getUTCMinutes();
        console.log(`current hour: ${hour}, minute: ${minut}`);
        let remainingHour;
        let remainingMinutes;
        if(hour > time.hour && minut === 0) {
            remainingHour = (24 + time.hour) - hour;
            remainingMinutes = 0;
        }
        else if(hour > time.hour && minut !== 0) {
            remainingHour = (24 + time.hour) - (hour + 1);
            remainingMinutes = 60 - minut;
        }
        else if(hour < time.hour && minut === 0) {
            remainingHour = time.hour - hour;
            remainingMinutes = 0;
        }
        else if(hour < time.hour && minut !== 0) {
            remainingHour = time.hour - (hour + 1);
            remainingMinutes = 60 - minut;
        }
        else if(hour === time.hour && minut === 0) { 
            remainingHour = 24;
            remainingMinutes = 0;
        }
        else if(hour === time.hour && minut !== 0 && time.minut === 0) {
            remainingHour = 23;
            remainingMinutes = 60 - minut;
        }
        else if(hour === time.hour && minut < time.minut) {
            remainingHour = 0;
            remainingMinutes = time.minut - minut;
            time.minut = 0;
        }

        if(time.minut !== 0) {
            remainingMinutes = remainingMinutes + time.minut;
        }
        if(remainingMinutes === 60) {
            remainingHour++;
            remainingMinutes = 0;
        }
        else if(remainingMinutes > 60) {
            remainingHour++;
            remainingMinutes = remainingMinutes - 60;
        }
    
        console.log('remainingHour: ', remainingHour, ', remainingMinutes: ', remainingMinutes);
        let remainingHourInMiliSec = remainingHour * 3600000;
        let remainingMinInMiliSec = remainingMinutes * 60000;
        let remainingTimeInMiliSec = remainingHourInMiliSec + remainingMinInMiliSec;
        console.log('remainingHour: ', remainingHourInMiliSec, ', remainingMinutes: ', remainingMinInMiliSec);
        return remainingTimeInMiliSec
    }

    async startLoop(time, chronFunc, chronFuncArg, status) {
        let remainingTimeInMiliSec;
        if(status) {
            remainingTimeInMiliSec = this.calcTime(time);
        }
        else {
            remainingTimeInMiliSec = 24 * 3600000;
        }
        
        let loopPromise = new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    chronFunc(chronFuncArg);
                    resolve(true);
                } catch (error) {
                    reject(error)
                }
                
            }, remainingTimeInMiliSec)
        })
        
        await loopPromise
        this.startLoop(time, chronFunc, chronFuncArg, false);
    }
}


// let chronos = new Chronos();
// chronos.startLoop({hour: 19, minut: 0}, ({names}) => {
//     console.log('idi naxui ', names);
// }, {names: 'ulan'}, true)




