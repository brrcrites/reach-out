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

class Button extends React.Component {
    render() {
        return(
            <button onClick={this.props.handleClick}>
                {this.props.text}
            </button>
        );
    }
}

ReactDOM.render(<Button text="PRESS" handleClick={() => { sendSMS(); }} />, document.body);
