import React from 'react';
import ReactDOM from 'react-dom';

// Make sure you've added your credentials to the creds.js file
import { accountSid, authToken } from './creds.js';

function Button({ text, handleClick }) {
    return(
        <button onClick={handleClick}>
            {text}
        </button>
    );
}

ReactDOM.render(<Button text="PRESS" handleClick={() => { alert('accountSid: ' + accountSid + ', authToken: ' + authToken ); }} />, document.getElementById('app'));

