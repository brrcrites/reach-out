import mongoose from 'mongoose';
import ScheduledMessage from './scheduledMessage.js';

const MessageSchema = new mongoose.Schema({
    fromSchedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScheduledMessage',
        default: null
    },
    toPhoneNumber: String,
    fromPhoneNumber: String,
    message: String,
    timeZone: String,
    time: {type: Date, index: true}, // Creation time
});

const Message = mongoose.model('message',MessageSchema);

export default Message;
