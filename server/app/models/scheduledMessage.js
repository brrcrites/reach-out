import mongoose from 'mongoose';
import moment from 'moment';

const ScheduledMessageSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: moment,
        get: (date) => { return moment(date); }
    },
    toPhoneNumber: { type: String, required: true },
    fromPhoneNumber: { type: String, required: true},
    scheduled_uuid: { type: String, default: null },
    enabled: { type: Boolean, default: true },
    message: { type: String, required: true },
    recurring: {
        rules: [{
            /* All are optional, if not included => '*' */
            dayOfWeek: [{ type: Number, min: 0, max: 6  }],
            month: { type: Number, min: 1, max: 12 },
            dayOfMonth: { type: Number, min: 1, max: 31 },
            hour: { type: Number, min: 0, max: 23 },
            minute: { type: Number, min: 0, max: 59 },
            second: { type: Number, min: 0, max: 59 }
            // Year is not included
        }],
        end: {
            // TODO: Is this a mongo type or can we use moment directly here?
            type: Date,
            min: [moment(),'Must be a date in the future'],
            get: (date) => { return moment(date); }
        }
    }
});

const ScheduledMessage = mongoose.model('scheduledMessage',ScheduledMessageSchema);

export default ScheduledMessage;
