import mongoose from 'mongoose';
import moment from 'moment';
import regeneratorRuntime from "regenerator-runtime";

import Message from '../app/models/message.js';
import ScheduledMessage from '../app/models/scheduledMessage.js';

const testMessage = {toPhoneNumber: "+18675309",fromPhoneNumber: "+18001010220",message: "Test message."};
const minRule = { dayOfWeek: 0, month: 1, dayOfMonth: 1, hour: 0, minute: 0};
const testSchedule = {toPhoneNumber: "+18675309",fromPhoneNumber: "+18001010220",message: "Test message.",
        recurring:{
            rules:[minRule],
        }
    };

describe('Message Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, 
            { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}, (err) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            });
    });
    afterAll(async() => {
        await mongoose.disconnect();
    });



    test('Create and save a message',async() => {
        const newMessage = new Message(testMessage);
        const savedMessage = await newMessage.save();

        expect(savedMessage._id).toBeDefined();
        expect(savedMessage.toPhoneNumber).toBe(testMessage.toPhoneNumber);
        expect(savedMessage.fromPhoneNumber).toBe(testMessage.fromPhoneNumber);
        expect(savedMessage.message).toBe(testMessage.message);
    });

    expect.extend({
        toBeDateBetween(received,start,end) {
            const pass = received.isBetween(start,end,null,'[]');
            if (pass) {
                return {
                    message: () => `expected created time: ${received} not to be between ${start} and ${end}`,
                    pass: true,
                };
            } else {
                return {
                    message: () => `expected created time: ${received} to be between ${start} and ${end}`,
                    pass: false,
                };
            }
    }});

    test('Create and save a scheduled message',async() => {
        testSchedule.recurring.end = moment().add(1,'days');
        const testStart = moment();
        const newScheduledMessage = new ScheduledMessage(testSchedule)
        const savedScheduledMessage = await newScheduledMessage.save();

        expect(savedScheduledMessage._id).toBeDefined();
        expect(savedScheduledMessage.toPhoneNumber).toBe(testSchedule.toPhoneNumber);
        expect(savedScheduledMessage.fromPhoneNumber).toBe(testSchedule.fromPhoneNumber);
        expect(savedScheduledMessage.message).toBe(testSchedule.message);
        expect(savedScheduledMessage.enabled).toBe(true);
        expect(savedScheduledMessage.created).toBeDateBetween(testStart,moment());
        expect(savedScheduledMessage.recurring.end.isSame(testSchedule.recurring.end)).toBe(true);
    });
});

