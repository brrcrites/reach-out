import mongoose from 'mongoose';
import regeneratorRuntime from "regenerator-runtime";

import Message from '../app/models/message.js';
//import ScheduledMessage from '../app/models/scheduledMessage.js';

const testMessage = { toPhoneNumber: "+18675309", fromPhoneNumber: "+18001010220", message: "Test message." }

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
});

