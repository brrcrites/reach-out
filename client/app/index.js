import React, { Component, useState } from 'react';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';

// Axios configuration for backend server is defined here
import client from './client.js';

function sendSMS(toNumber, message, setResponse) {
    console.log(`to number: ${toNumber}`);
    console.log(`message: ${message}`)

    // Create payload for POST
    var data = JSON.stringify({
        toNumber: toNumber,
        message: message,
    })
   console.log(`payload data: ${data}`)

   // Post the request to have the sms sent
   client.post('/send-sms', data, { headers: { 'Content-Type': 'application/json' } })
   // Handle success case
   .then( (response) => {
       console.log(response);
       setResponse(response.data);
   })
   // Handle failure case
   .catch( (response) => {
       console.error(response);
   });
}

const InputForm = () => {
    const [toNumber, setToNumber] = useState('+1');
    const [message, setMessage] = useState('This is a default test message');
    const [response, setResponse] = useState('No Message');

    return (
        <div>
            <form onSubmit={ (event) => { event.preventDefault(); sendSMS(toNumber, message, setResponse)} }>
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
            <div>
                { response }
            </div>
        </div>
    );
}

const Admin = () => {
    return(
        <div>
            <p>This is the Admin Panel</p>
        </div>
    )
}

const Error = () => {
    return(
        <div>
            <p>Error: Page does not exist!</p>
        </div>
    )
}

const Navigation = () => {
    return(
        <div>
            <ul>
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/admin'>Admin Panel</NavLink></li>
            </ul>
        </div>
    );
}

class App extends Component {
    render() {
        return(
            <BrowserRouter>
            <div>
                <Navigation />
                <Switch>
                    <Route path='/' component={InputForm} exact />
                    <Route path='/admin' component={Admin} />
                    <Route component={Error} />
                </Switch>
            </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));