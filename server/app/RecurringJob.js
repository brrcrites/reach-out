import schedule from 'node-schedule';
import { v4 as uuidv4 } from 'uuid';
import ScheduledMessage from './models/scheduledMessage.js';
import Message from './models/message.js';
import moment from 'moment';

class RecurringJobSystem {
    constructor(client) {
        this.jobCache = new Map();
        this.client = client;
    }

    getAll(callback) {
        ScheduledMessage.find({}, function(err, result) {
            if(err) {
                console.error(error);
                callback(error, []);
            } else {
                callback(null, result);
            }
        });
    }

    getEnabled(callback) {
        // Jobs that are past their end point are not active, even if they haven't been specifically disabled
        // TODO: We need to test this query syntax, and it currently only checks enabled since recurring.end is
        // an optional field and idk how to say 'if it isn't present or is $gt now'
        const filterValues = this.getRunning();
        ScheduledMessage.find({ 'enabled': true }, function(err, result) {
            if(err) {
                console.error(error);
                callback(error, []);
            } else {
                // TODO: This is a monkey patch so that the Enabled will only return currently cached jobs to the
                // front end. This should be removed once we have the recurring job system internal data model corrected
                // so that the mongo db and server are always in agreement with what is/should be running
                const filteredResults = result.filter((record) => { return filterValues.includes(record.scheduled_uuid) } )
                callback(null, filteredResults);
            }
        });
    }

    getRunning() {
        // Spread operator to convert the keys iterator to an array
        return [...this.jobCache.keys()];
    }

    isRunning(jobUUID) {
        return this.jobCache.has(jobUUID);
    }

    getJob(jobUUID) {
        // TODO: Should this look into the mongo db for the job since its by ID? perhaps getRunning with an ID
        // returns running only and getJob return running or mongo?
        return this.jobCache.has(jobUUID)? this.jobCache.get(jobUUID): null;
    }

    createJob({
        second = null,
        minute = null,
        hour = null,
        dayOfWeek = null,
        message,
        toNumber,
        type = 'debug',
        uuid = null,
    }) {
        // Allowing the user to pass in an optional uuid for the future case
        // where we need to reboot the server and want it to be bootstrapped
        // from the mongo db and carry the old uuids for book keeping
        const jobUUID = (uuid) ? uuid : uuidv4();

        // Create the mongo model for the recurring job and use it as the
        // validation step
        const scheduledMessage = new ScheduledMessage({
            toPhoneNumber: toNumber,
            message: message,
            scheduled_uuid: jobUUID,
            fromPhoneNumber: process.env.TWILIO_SMS_NUMBER,
            recurring: {
                rules: [{
                    dayOfWeek: dayOfWeek,
                    hour: hour,
                    minute: minute,
                    second: second,
                }]
            }
            // TODO: We should save the type here as well
        });
        scheduledMessage.save( (err,msg) => { if (err) { console.error(err); return jobUUID; } });
        // TODO: Figure out how we want to handle the above failure case
        console.log(`${jobUUID} -- job saved`);

        const job = this._createCron(scheduledMessage, type);
        console.log(`${jobUUID} -- job created with type ${type}`);

        // Cache the job so we can keep track of it
        this.jobCache.set(jobUUID, job);
        console.log(`${jobUUID} -- job registered`);

        return jobUUID;
    }

    deleteJob(jobUUID) {
        console.log(`${jobUUID} -- attempting to delete job`)

        if (this.jobCache.has(jobUUID)) {
            // Cancel the job and remove it from the cache
            ScheduledMessage.updateOne({scheduled_uuid: jobUUID},{$set:{enabled: false}},function(err,res) {
                if (err) { console.log(err); }
            });
            this.jobCache.get(jobUUID).cancel();
            this.jobCache.delete(jobUUID);
            console.log(`${jobUUID} -- job found and cancelled`);
            return true;
        } 

        console.error(`${jobUUID} -- job not found`);
        return false;
    }

    // Note: Using the _ as a "standard" for defining private members and functions
    _createCron(model, type) {
        console.log(model);
        // All null values will have the system run every 1 min
        var rule = new schedule.RecurrenceRule();
        // TODO: We're currently only using the first recurrence rule, we should either change this to be
        // not an array in the db or we should iterate here
        const modelRules = model.recurring.rules[0];

        if (modelRules.second !== null) { rule.second = modelRules.second }
        // Everything defaults to null except second, so we don't need
        // to check here before setting
        rule.minute = modelRules.minute;
        rule.hour = modelRules.hour;
        // The cron doesn't take an empty array and it must be replaced with a null
        rule.dayOfWeek = (modelRules.dayOfWeek && modelRules.dayOfWeek.length > 0) ? modelRules.dayOfWeek : null;
        console.log(`Rule: ${JSON.stringify(rule)}`);

        return schedule.scheduleJob(rule, () => {
            if (type == 'sms') {
                this._smsMessageJob(model);
            }
            else if (type == 'voice') {
                this._voiceMessageJob(model);
            }
            else {
                // TODO: Right now we assume anything besides sms or voice is intended to be a debug, but we
                // should probably error instead if it isn't exactly a debug
                this._debugMessageJob(model);
            }
        });
    }

    // Note that the below sms, voice, and debug message jobs are intended to be run asycnronously within a cron
    _smsMessageJob(model) {
        this.client.messages.create({
            body: model.message,
            from: process.env.TWILIO_SMS_NUMBER,
            to: model.toPhoneNumber
        })
        .then(() => {
            // Log message in db
            const message = new Message({
                toPhoneNumber: model.toPhoneNumber,
                fromPhoneNumber: process.env.TWILIO_SMS_NUMBER,
                message: model.message,
                time: moment()
            });
            message.save()
            .catch((error) => {
                console.error(error);
                // TODO: We probably need to actually do something here in the long term besides log to console
            });
        })
        .catch((error) => {
            console.error(error);
            // TODO: We probably need to actually do something here in the long term besides log to console
        });
    }

    _voiceMessageJob(model) {
        console.error('TODO: Implement voice message job functionality')
    }

    _debugMessageJob(model) {
        console.log(`[${new Date()}] ${model.message} being mock sent to ${model.toPhoneNumber}`);
        // Log message in db, even when we are in debug mode so we can easily test portions which utilize the db
        const message = new Message({
            toPhoneNumber: model.toPhoneNumber,
            fromPhoneNumber: process.env.TWILIO_SMS_NUMBER,
            message: model.message,
            time: moment()
        });
        message.save()
        .catch((error) => {
            console.error(error);
            // TODO: We probably need to actually do something here in the long term besides log to console
        });
    }
}

export default RecurringJobSystem;
