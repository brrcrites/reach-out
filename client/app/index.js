import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// Axios configuration for backend server is defined here
import client from './client.js';

function sendSMS(toNumber, message) {
    console.log(`to number: ${toNumber}`);
    console.log(`message: ${message}`)

    // Create payload for POST
    var data = JSON.stringify({
        toNumber: toNumber,
        message: message,
    })
   console.log(`payload data: ${data}`)

   // Post the request to have the sms sent
   client.post('/send-sms', data, { headers: { 'Content-Type': 'application/json' } } )
   // Handle success case
   .then(function(response) {
       console.log(response);
   })
   // Handle failure case
   .catch(function(response) {
       console.log(response);
   });
}

function InputForm() {
    const [toNumber, setToNumber] = useState('+1');
    const [message, setMessage] = useState('This is a default test message');

    return (
        <form onSubmit={ () => {sendSMS(toNumber, message)} }>
            <label>
                Send Message To:
                <input 
                    type="text" 
                    value={toNumber} 
                    onChange={ e => setToNumber(e.target.value) }
                />
            </label>
            <br />
            <label>
                Message:
                <input
                    type="text"
                    value={message}
                    onChange={ e => setMessage(e.target.value) } 
                />
            </label>
            <br />
            <input type="submit" value="Submit" />
        </form>
    );
}

ReactDOM.render(<InputForm />, document.getElementById('app'));