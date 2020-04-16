import mongoose from 'mongoose';
import moment from 'moment';
import ScheduledMessage from './scheduledMessage.js';

const MessageSchema = new mongoose.Schema({
    fromSchedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScheduledMessage',
        default: null
    },
    toPhoneNumber: { type: String, required: true },
    fromPhoneNumber: { type: String, required: true },
    message: { type: String, required: true },
    timeZone: String,
    time: {type: Date, index: true, default: moment }, 
});

const Message = mongoose.model('message',MessageSchema);

export default Message;
