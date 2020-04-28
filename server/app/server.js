import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import twilio from 'twilio';
import Message from './models/message.js';
import MessageResponse from './models/messageResponse.js';
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
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize twilio client so we can send messages
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Initialize job system for working with recurring tasks and save it as a local variable to the app
app.locals.jobSystem = new RecurringJobSystem(client);

app.post('/sms-response', function(req, res, next) {
    const originalMessage = Message.find({ toPhoneNumber: req.body.From })
        .sort('-time').exec(function(err,docs) {
            if (err) { console.error(err); } 
            else if (docs.length == 0) { console.error(`No messages sent to ${req.body.From}`); }
            else { 
                const response = new MessageResponse({
                    responseTo: docs[0]._id,
                    fromPhoneNumber: req.body.From,
                    message: req.body.Body
                });
                response.save()
                    .then(()=> { 
                        console.log(`Saved ${response.message} as response to ${docs[0].message}.`); })
                    .catch((err)=>{ console.error(err); });
            }
        });
    return res.sendStatus(204); // Send "No Content" 
});
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

// TODO: Add query parameter here to look for a specific to number
app.get('/messages-sent', function(req, res, next) {
    Message.find({}).sort('-time').exec(function(err, result) {
        if(err) {
            return res.send(err);
        } else {
            // Sanitize the message before returning it
            return res.json(result.map( (item) => { return sanitizeMessage(item); }));
        }
    });
});

// TODO: Add query parameter here to look for a specific (from?) number
// TODO: Create a 'sanitizeMessage' for the responses
app.get('/messages-received', function(req, res, next) {
    MessageResponse.find({}).sort('-time').exec(function(err,result) {
        if (err) {
            return res.send(err);
        } else {
            return res.json(result);
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
        type: req.body?.type,
        minute: req.body?.minute,
        hour: req.body?.hour,
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
        // TODO: Follow this down to a monkey patch to filter out when the recurring job systems cache
        // and the mongo don't match
        return app.locals.jobSystem.getEnabled(resCallback);
    }
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})

