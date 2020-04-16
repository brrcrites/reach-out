import schedule from 'node-schedule';
import { v4 as uuidv4 } from 'uuid';

class RecurringJobSystem {
    constructor() {
        this.jobCache = new Map();
    }

    getIds() {
        // Spread operator to convert the keys iterator to an array
        return [...this.jobCache.keys()];
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
        toNumber,
        uuid = null
    }) {
        // TODO: We should check that there is a valid message and toNumber here
        // and then throw some type of error if they aren't valid

        // All null values will have the system run every 1 min
        var rule = new schedule.RecurrenceRule();

        if (second !== null) { rule.second = second }
        // Everything defaults to null except second, so we don't need
        // to check here before setting
        rule.minute = (minute) ? minute : null;
        rule.hour = (hour) ? hour : null;
        rule.date = (date) ? date : null;
        rule.month = (month) ? month : null;
        rule.year = (year) ? year : null;
        rule.dayOfWeek = (dayOfWeek) ? dayOfWeek : null;
        console.log(`Rule: ${JSON.stringify(rule)}`);

        // Allowing the user to pass in an optional uuid for the future case
        // where we need to reboot the server and want it to be bootstrapped
        // from the mongo db and carry the old uuids for book keeping
        const jobUUID = (uuid) ? uuid : uuidv4();

        var job = schedule.scheduleJob(rule, () => {
            // We will want to replace this with a twilio sms function here
            // or let users pass in a function
            console.log(`[${new Date()}] ${message} being mock sent to ${toNumber}`);
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
