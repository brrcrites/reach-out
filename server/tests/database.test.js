import mongoose from 'mongoose';
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

describe.only('Message Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, 
            { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}, (err) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            });
    });

    test('Create and save a message',async() => {
        const newMessage = new Message(testMessage);
        const savedMessage = await newMessage.save();

        expect(savedMessage._id).toBeDefined();
        expect(savedMessage.toPhoneNumber).toBe(testMessage.toPhoneNumber);
        expect(savedMessage.fromPhoneNumber).toBe(testMessage.fromPhoneNumber);
        expect(savedMessage.message).toBe(testMessage.message);
    });

    // Try catch ValidationError
    test('Create and save a scheduled message',async() => {
        const current = Date.now();
        testSchedule.created = current;
        testSchedule.recurring.end = Date(current.getDate() + 1);
        const newScheduledMessage = new ScheduledMessage(testSchedule)
        const savedScheduledMessage = await newScheduledMessage.save();

        expect(savedScheduledMessage._id).toBeDefined();
        expect(savedScheduledMessage.toPhoneNumber).toBe(testSchedule.toPhoneNumber);
        expect(savedScheduledMessage.fromPhoneNumber).toBe(testSchedule.fromPhoneNumber);
        expect(savedScheduledMessage.message).toBe(testSchedule.message);
        expect(savedScheduledMessage.enabled).toBe(true);
        expect(savedScheduledMessage.created.getDate()).toBe(current.getDate());
        expect(savedScheduledMessage.recurring.rules).toBe(minRule);
    });
});

    /*created: {
        type: Date,
        default: Date.now
    },
    toPhoneNumber: String,
    fromPhoneNumber: String,
    enabled: { type: Boolean, default: true },
    message: String,
    recurring: {
        rules: [{
            /* All are optional, if not included => '*' * /
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
    }*/
