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
        console.log(`Rule: ${JSON.stringify(rule)}`);

        // Allowing the user to pass in an optional uuid for the future case
        // where we need to reboot the server and want it to be bootstrapped
        // from the mongo db and carry the old uuids for book keeping
        const jobUUID = (uuid === null) ? uuidv4() : uuid;

        var job = schedule.scheduleJob(rule, () => {
            // We will want to replace this with a twilio sms function here
            // or let users pass in a function
            console.log(`[${new Date()}] ${message}`);
        })
        console.log(`${jobUUID} -- job created`)

        // Cache the job so we can keep track of it
        this.jobCache.set(jobUUID, job);
        console.log(`${jobUUID} -- job registered`);

        return jobUUID;
    }

    deleteJob(jobUUID) {
        console.log(`${jobUUID} -- attempting to delete job`)

        if (this.jobCache.has(jobUUID)) {
            // Cancel the job and remove it from the cache
            this.jobCache.get(jobUUID).cancel();
            this.jobCache.delete(jobUUID);
            console.log(`${jobUUID} -- job found and cancelled`);
            return true;
        } 

        console.error(`${jobUUID} -- job not found`);
        return false;
    }
}

export default RecurringJobSystem;
