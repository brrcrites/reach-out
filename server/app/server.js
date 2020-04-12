import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import twilio from 'twilio';
import Message from './models/message.js';
import moment from 'moment';
import RecurringJobSystem from './RecurringJob';

// Make sure we have the .env values we need before booting the server
// The .emv file is pulled in automatically by the dotenv-webpack package
if(!process.env.TWILIO_SMS_NUMBER) {
    throw('Missing TWILIO_SMS_NUMBER in .env file');
}
if(!process.env.TWILIO_ACCOUNT_SID) {
    throw('Missing TWILIO_ACCOUNT_SID in .env file');
}
if(!process.env.TWILIO_AUTH_TOKEN) {
    throw('Missing TWILIO_AUTH_TOKEN in .env file');
}

// Create express application server for serving the routes
const app = express();
app.use(cors()); // TODO: This allows CORS requests to the server and was necessary for local dev, can we remove it when using docker?
app.use(bodyParser.json()); // Allows JSON payloads in the body of requests

// Initialize twilio client so we can send messages
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Initialize job system for working with recurring tasks and save it as a local variable to the app
app.locals.jobSystem = new RecurringJobSystem();

// TODO: For now I'm just sending the error messages through to the frontend to aid in debugging, but we should probably
// update these to sanitize the messages in the future
app.post('/send-sms', function(req, res, next) {
    console.log(`/send-sms body: ${JSON.stringify(req.body)}`);
    // Send SMS
    client.messages.create({
        body: req.body.message,
        from: process.env.TWILIO_SMS_NUMBER,
        to: req.body.toNumber
    })
    .then(() => { 
        // Log message in db
        const message = new Message({
            toPhoneNumber: req.body.toNumber,
            fromPhoneNumber: process.env.TWILIO_SMS_NUMBER,
            message: req.body.message,
            time: moment()
        });
        message.save()
        .then(() => { 
            res.sendStatus(200);
        })
        .catch((error) => { 
            console.error(error);
            res.status(500).send(error); 
        });
    }) 
    .catch((error) => {
        console.error(error);
        res.status(500).send(error);
    });
});

function sanitizeMessage(message) {
    return {
        'toPhoneNumber': message.toPhoneNumber,
        'fromPhoneNumber': message.fromPhoneNumber,
        'message': message.message,
        'time': message.time
    }
}

app.get('/message-history', function(req, res, next) {
    Message.find({}, function(err, result) {
        if(err) {
            res.send(err);
        } else {
            // Sanitize the message before returning it
            res.json(result.map( (item) => { return sanitizeMessage(item); }));
        }
    });
});

app.post('/recurring-create', function(req, res, next) {
    console.log(`/recurring-create body: ${JSON.stringify(req.body)}`);
    const jobUUID = app.locals.jobSystem.createJob({
        message: req.body.message
    });
    console.log(`${jobUUID} -- job successfully created using /recurring-create endpoint`)
    res.sendStatus(200);
});

app.post('/recurring-delete', function(req, res, next) {
    console.log(`/recurring-delete body: ${JSON.stringify(req.body)}`);
    if (app.locals.jobSystem.deleteJob(req.body.uuid)) {
        console.log(`${req.body.uuid} -- job successfully deleted using /recurring-delete endpoint`)
        res.sendStatus(200);
    } else {
        console.log(`${req.body.uuid} -- job failed to delete using /recurring-delete endpoint`)
        res.sendStatus(406); // Not Acceptable?
    }
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})


