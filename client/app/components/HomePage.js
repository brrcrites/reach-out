import React, { useState } from 'react';
import styled from 'styled-components';
import Banner from '../images/banner-1.jpg'

// Axios configuration for backend server is defined here
import client from '../client.js';

const BannerStyle = styled.div`
    overflow: hidden;
    width: 100%;
    height: 600px;
`;

function sendSms(toNumber, message, setResponse) {
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
       setResponse(response.data);
   });
}

const HomePage = () => {
    const [toNumber, setToNumber] = useState('+1');
    const [message, setMessage] = useState('This is a default test message');
    const [response, setResponse] = useState('No Message');
    const banner = new Image();
    banner.src = Banner;

    return (
        <div>
            <BannerStyle>
                <img src={Banner} />
            </BannerStyle>
            <h1>Home (Test) Page</h1>
            <h2>Send Single Text Message</h2>
            <form onSubmit={ (event) => { event.preventDefault(); sendSms(toNumber, message, setResponse); } }>
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

export default HomePage;