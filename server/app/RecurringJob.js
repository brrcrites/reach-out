import schedule from 'node-schedule';
import { v4 as uuidv4 } from 'uuid';

class RecurringJobSystem {
    constructor() {
        this.jobCache = new Map();
    }
    
    createJob({
        second = null,
        minute = null,
        hour = null,
        date = null,
        month = null,
        year = null,
        dayOfWeek = null,
        message,
        uuid = null
    }) {
        // All null values will have the system run every 1 min
        console.log(`second: ${second}`);
        console.log(`minute: ${minute}`);
        console.log(`hour: ${hour}`);
        console.log(`date: ${date}`);
        console.log(`month: ${month}`);
        console.log(`year: ${year}`);
        console.log(`dayOfWeek: ${dayOfWeek}`);

        var rule = new schedule.RecurrenceRule();
        if (second !== null) {
            rule.second = second;
        }
        // Everything defaults to null except second, so we don't need
        // to check here before setting
        rule.minute = minute;
        rule.hour = hour;
        rule.date = date;
        rule.month = month;
        rule.year = year;
        rule.dayOfWeek = dayOfWeek;

        const jobUUID = (uuid === null) ? uuidv4() : uuid;
        this.jobCache.set(jobUUID, job)
        console.log(`Caching job with uuid ${jobUUID}`);

        console.log(`Rule: ${JSON.stringify(rule)}`);
        var job = schedule.scheduleJob(rule, () => {
            console.log(`[${new Date()}] ${message}`);
        })
    }

    deleteJob(jobUUID) {
        if (this.jobCache.get(jobUUID) !== undefined) {
            this.jobCache.get(jobUUID).cancel();
            return true;
        } 
        console.error(`Job UUID ${jobUUID} does not match a registerd job`);
        return false;
    }
}

export default RecurringJobSystem;
