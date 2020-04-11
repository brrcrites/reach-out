import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import twilio from 'twilio';
import Message from './models/message.js';
import moment from 'moment';

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

const app = express();
// TODO: This allows CORS requests to the server and was necessary for local dev, can we remove it when using docker?
app.use(cors());
// Allows JSON payloads in the body of requests
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/send-sms', function(req, res, next) {
    console.log(`body: ${JSON.stringify(req.body)}`);
    client.messages.create({
        body: req.body.message,
        from: process.env.TWILIO_SMS_NUMBER,
        to: req.body.toNumber
    })
    .then(
        () => { 
            const message = new Message({
                toPhoneNumber: req.body.toNumber,
                fromPhoneNumber: process.env.TWILIO_SMS_NUMBER,
                message: req.body.message,
                time: moment()
            });
            message.save().then(() => { res.send('SUCCESS - POST request to /send-sms'); })
                .catch((error) => { 
                    console.error(error);res.send('ERROR - Message sent but DB save failed'); 
                });
        }
    ) .catch(
        (error) => {
            console.error(error);
            res.send('ERROR - POST request to /send-sms');
        }
    )
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

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})


