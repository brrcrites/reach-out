import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    toPhoneNumber: String,
    fromPhoneNumber: String,
    message: String,
    timeZone: String,
    time: {type: Date, index: true},
});

const Message = mongoose.model('message',MessageSchema);

export default Message;
