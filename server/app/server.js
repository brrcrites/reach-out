import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import twilio from 'twilio';
import Message from './app/models/message.js';

// Make sure we have the .env values we need before booting the server
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
app.use(cors());
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
                time: moment(req.body.time,'MM-DD-YYYY hh:mma')
            });
            message.save().then(() => { res.send('SUCCESS - POST request to /send-sms'); })
                .catch((error) => { 
                    console.error(error);res.send('ERROR - Message sent but DB save failed'); 
                });
        }
    )
    .catch(
        (error) => {
            console.error(error);
            res.send('ERROR - POST request to /send-sms');
        }
    )
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})


