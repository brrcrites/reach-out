import mongoose from 'mongoose';
import moment from 'moment';
import Message from './message.js';

const MessageResponseSchema = new mongoose.Schema({
    responseTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    fromPhoneNumber: { type: String, required: true },
    message: { type: String, required: true },
    timeZone: String,
    time: {type: Date, index: true, default: moment }, 
});

const MessageResponse = mongoose.model('messageResponse',MessageResponseSchema);

export default MessageResponse;
