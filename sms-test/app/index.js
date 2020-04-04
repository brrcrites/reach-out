import React from 'react';
import ReactDOM from 'react-dom';
import twilio from 'twilio';

// Make sure you've added your credentials to the creds.js file
import { accountSid, authToken } from './creds.js';

var client = new twilio(accountSid, authToken);

function sendSMS() {
    console.log(client)
    client.messages.create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+12054097549',
        to: '+16264826578'
    })
    .then(message => console.log(message.sid));
}

function Button({ text, handleClick }) {
    return(
        <button onClick={handleClick}>
            {text}
        </button>
    );
}

ReactDOM.render(<Button text="PRESS" handleClick={() => { sendSMS(); }} />, document.getElementById('app'));

