'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const Twilio = require('twilio');

const MessageSchema = new mongoose.Schema({
    toPhoneNumber: String,
    fromPhoneNumber: String,
    message: String,
    timeZone: String,
    time: {type: Date, index: true},
});

const Message = mongoose.model('message',MessageSchema);
module.exports = Message;

