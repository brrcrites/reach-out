import mongoose from 'mongoose';

const ScheduledMessageSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    toPhoneNumber: String,
    fromPhoneNumber: String,
    enabled: { type: Boolean, default: true },
    message: String,
    recurring: {
        rules: [{
            /* All are optional, if not included => '*' */
            dayOfWeek: { type: Number, min: 0, max: 6  },
            month: { type: Number, min: 1, max: 12 },
            dayOfMonth: { type: Number, min: 1, max: 31 },
            hour: { type: Number, min: 0, max: 23 },
            minute: { type: Number, min: 0, max: 59 },
            second: { type: Number, min: 0, max: 59 }
            // Year is not included
        }],
        end: {
            type: Date,
            min: [Date.now,'Must be a date in the future']
        }
    }
});

const ScheduledMessage = mongoose.model('scheduledMessage',ScheduledMessageSchema);

export default ScheduledMessage;
