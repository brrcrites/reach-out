import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import twilio from 'twilio';
import Message from './models/message.js';
import ScheduledMessage from './models/scheduledMessage.js';
import moment from 'moment';
import RecurringJobSystem from './RecurringJob';
import db from './src/database.js';

db.on('error',console.error.bind(console,'MongoDB Connection Error:'));
db.once('open', () => {
    // We're connected!
    console.log('MongoDB Connection Successful');
});

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
            console.log('Saved');
            return res.sendStatus(200);
        })
        .catch((error) => { 
            console.error(error);
            return res.status(500).send(error);
        });
    }) 
    .catch((error) => {
        console.error(error);
        return res.status(500).send(error);
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
            return res.send(err);
        } else {
            // Sanitize the message before returning it
            return res.json(result.map( (item) => { return sanitizeMessage(item); }));
        }
    });
});

app.post('/recurring-create', function(req, res, next) {
    console.log(`/recurring-create body: ${JSON.stringify(req.body)}`);
    if (!req.body?.toNumber || !req.body?.message) {
        return res.sendStatus(406);
    }
    const jobUUID = app.locals.jobSystem.createJob({
        toNumber: req.body.toNumber,
        message: req.body.message,
        minute: req.body?.minute,
        hour: req.body?.hour,
        date: req.body?.date,
        month: req.boty?.month,
        year: req.body?.year,
        dayOfWeek: req.body?.dayOfWeek
    });

    console.log(`${jobUUID} -- job successfully created using /recurring-create endpoint`)
    return res.sendStatus(200);
});

app.post('/recurring-delete', function(req, res, next) {
    console.log(`/recurring-delete body: ${JSON.stringify(req.body)}`);
    if (app.locals.jobSystem.deleteJob(req.body.uuid)) {
        console.log(`${req.body.uuid} -- job successfully deleted using /recurring-delete endpoint`)
        return res.sendStatus(200);
    } else {
        console.log(`${req.body.uuid} -- job failed to delete using /recurring-delete endpoint`)
        return res.sendStatus(406); // Not Acceptable?
    }
});

app.get('/recurring-list', function(req, res, next) {
    console.log(`/recurring-list query params: ${JSON.stringify(req.query)}`);
    // TODO: The query param here is a string not a boolean, is it worth using this npm package just to
    // get the query params to conver to boolenas? https://www.npmjs.com/package/express-query-boolean
    const resCallback = (error, results) => {
        if (error) {
            // TODO: I don't know exactly what this does so we should test that it works correctly
            return next(error);
        } else {
            return res.json(results);
        }
    }
    if (req.query?.all === 'true') {
        return app.locals.jobSystem.getAll(resCallback);
    } else {
        return app.locals.jobSystem.getEnabled(resCallback);
    }
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})

