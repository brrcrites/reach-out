import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Axios configuration for backend server is defined here
import client from '../client.js';

// Source: https://codepen.io/samuelkraft/pen/Farhl
// Source: https://leaverou.github.io/bubbly/
// Source: https://codepen.io/swards/pen/gxQmbj

// TODO: Figure out how to left/right justify the different bubbles
const Chat = styled.div`
display: flex;
flex-direction: column;
font-family: "Helvetica Neue";
padding: 20px;
`;

const ReceivedMessage = styled.div`
position: relative;
color: black;
background: #E5E5EA;
border-radius: .4em;
padding: 10px;
margin-bottom: 10px;
max-width: 40%;

&:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-right-color: #E5E5EA;
	border-left: 0;
	border-bottom: 0;
	margin-top: -10px;
	margin-left: -20px;
}
`;

const SentMessage = styled.div`
position: relative;
color: white;
background: #0B93F6;
border-radius: .4em;
padding: 10px;
margin-bottom: 10px;
max-width: 40%;

&:after {
	content: '';
	position: absolute;
	right: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-left-color: #0B93F6;
	border-right: 0;
	border-bottom: 0;
	margin-top: -10px;
	margin-right: -20px;
}
`;

function compareByTimestamp(a, b) {
    if (a.time < b.time) {
        return -1;
    }
    if (a.time > b.time) {
        return 1;
    }
    return 0;
}

function sortAndZipperChatHistory(received, sent, filterNumber) {
    // Sort is in-place so we need to make a copy before modifying it
    let receivedSorted = (received) ? [...received].sort(compareByTimestamp) : [];
    let sentSorted = (sent) ? [...sent].sort(compareByTimestamp) : [];
    let generatedReturn = []

    while (receivedSorted.length && sentSorted.length) {
        if (receivedSorted[0].time < sentSorted[0].time) {
            generatedReturn = generatedReturn.concat({ 'type': 'received', 'obj': receivedSorted[0] });
            receivedSorted.shift();
        } else {
            generatedReturn = generatedReturn.concat({ 'type': 'sent', 'obj': sentSorted[0] });
            sentSorted.shift();
        }
    }
    // TODO: Concat can append the entire list, how can I leverage that here rather than having to iterate over the whole thing?
    while (receivedSorted.length > 0) {
        generatedReturn = generatedReturn.concat({ 'type': 'received', 'obj': receivedSorted[0] });
        receivedSorted.shift();
    }
    while (sentSorted.length > 0) {
        generatedReturn = generatedReturn.concat({ 'type': 'sent', 'obj': sentSorted[0] });
        sentSorted.shift();
    }

    return generatedReturn;
}

function loadPossibleNumbers(sent, received, callback) {
    let numbersArray = [];

    // TODO: We could probably concat the two arrays together and then run this over both at the same time
    sent.forEach( (value) => { 
        if (!numbersArray.includes(value.toPhoneNumber)) {
            numbersArray = numbersArray.concat(value.toPhoneNumber);
        }
    });

    received.forEach( (value) => { 
        if (!numbersArray.includes(value.toPhoneNumber)) {
            numbersArray = numbersArray.concat(value.toPhoneNumber);
        }
    });

    callback(numbersArray);
}

const ChatHistory = () => {
    const [messagesSent, setMessagesSent] = useState([]);
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [possibleNumbers, setPossibleNumbers] = useState([]);
    const [filterNumber, setFilterNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getMessagesSent = async () => {
        const response = await client.get('/messages-sent');
        setMessagesSent(response.data);
    }

    const getMessagesReceived = async () => {
        const response = await client.get('/messages-received');
        setMessagesReceived(response.data);
    }

    const loadData = async () => {
        try {
            setLoading(true);
            await getMessagesSent();
            await getMessagesReceived();
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    // The useEffect hook will re-execute (and I believe re-render the component) whenever one of the values in the second parameter changes. Since the second
    // parameter is an empty array, it will be run exactly once when the component loads
    useEffect(() => {
        loadData();
    }, []);

    // Each time the messages sent or received are updated they will cause a subsequent trigger to set all the possible numbers (set of unique external numbers)
    useEffect(() => {
        loadPossibleNumbers(messagesSent, messagesReceived, setPossibleNumbers);
        (possibleNumbers.length > 0 && filterNumber === '') ? setFilterNumber(possibleNumbers[0]) : '';
    }, [messagesSent, messagesReceived]);

    if (loading) { return (<h1>LOADING</h1>)}
    return(
        <div>
            <h1>Chat History</h1>
                Show Messages To ...
                <select id="type" name="type" value={filterNumber} onChange={ (e) => { setFilterNumber(e.target.value) }}>
                    { 
                        possibleNumbers && possibleNumbers.map( (item) => {
                            return <option value={item}>{item}</option>
                        })
                    }
                </select>
                <Chat>
                {
                    (messagesSent || messagesReceived) && sortAndZipperChatHistory(messagesReceived, messagesSent).map( (item, index) => {
                        if (item.type == 'received' && item.obj.fromPhoneNumber === filterNumber) {
                            return <ReceivedMessage key={index}>RECEIVED: {item.obj.time} -- [from: {item.obj.fromPhoneNumber}] -- {item.obj.message}</ReceivedMessage>
                        } else if (item.obj.toPhoneNumber === filterNumber) {
                            return <SentMessage key={index}>SENT: {item.obj.time} -- [from: {item.obj.fromPhoneNumber}] -- {item.obj.message}</SentMessage>
                        }
                    })
                }
                </Chat>
        </div>
    )
}

export default ChatHistory;
