import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import twilio from 'twilio';

// Make sure you've added your credentials to the creds.js file
import { accountSid, authToken, twilioSmsNumber } from './creds.js';

var client = new twilio(accountSid, authToken);

function sendSMS(toNumber) {
    console.log('to number: ', toNumber);
    client.messages.create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: twilioSmsNumber,
        to: toNumber
    })
    .then(message => console.log(message.sid));
}

function InputForm() {
    const [toNumber, setToNumber] = useState('+1');

    return (
        <form onSubmit={ () => {sendSMS(toNumber)} }>
            <label>
                Send Message To:
                <input 
                    type="text" 
                    value={toNumber} 
                    onChange={ e => setToNumber(e.target.value) } />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
}

ReactDOM.render(<InputForm />, document.body);
