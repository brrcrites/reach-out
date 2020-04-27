import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Axios configuration for backend server is defined here
import client from '../client.js';

// Source: https://codepen.io/samuelkraft/pen/Farhl
// Source: https://leaverou.github.io/bubbly/
// Source: https://codepen.io/swards/pen/gxQmbj
const Chat = styled.div`
display: flex;
flex-direction: column;
font-family: "Helvetica Neue";
`;

const ReceivedMessage = styled.div`
position: relative;
color: black;
background: #E5E5EA;
border-radius: .4em;
padding: 10px;
align-self: left;
align-content: left;
margin-top: 10px;
max-width: 40%;

&:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-right-color: #00aabb;
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
align-self: right;
align-content: right;
margin-top: 10px;
max-width: 40%;

&:after {
	content: '';
	position: absolute;
	right: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-left-color: #00aabb;
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

// TODO: Need to annotate if its a send or recieve so it can be handled differently
// in the rendering
function sortAndZipperChatHistory(received, sent) {
    let receivedSorted = (received) ? received.sort(compareByTimestamp) : [];
    let sentSorted = (sent) ? sent.sort(compareByTimestamp) : [];
    let generatedReturn = []

    while (receivedSorted.length > 0 && sentSorted.length > 0) {
        if (receivedSorted[0].time < sentSorted[0].time) {
            generatedReturn = generatedReturn.concat({ 'type': 'received', 'obj': receivedSorted[0] });
            receivedSorted.shift();
        } else {
            generatedReturn = generatedReturn.concat({ 'type': 'sent', 'obj': sentSorted[0] });
            sentSorted.shift();
        }
    }
    // TODO: Concat can append the entire list, how can I leverage that here rather
    // than having to iterate over the whole thing?
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

const AdminPanel = () => {
    const [messagesSent, setMessagesSent] = useState([]);
    const [messagesReceived, setMessagesReceived] = useState([]);
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

    // The useEffect hook will re-execute (and I believe re-render the component)
    // whenever one of the values in the second parameter changes. Since the second
    // parameter is an empty array, it will be run exactly once when the component
    // loads
    useEffect(() => {
        loadData();
    }, []);

    if (loading) { return (<h1>LOADING</h1>)}
    return(
        <div>
            <h1>Admin Panel Page</h1>
            <h2>Sent Message History:</h2>
                <ul>
                {
                    // Check that there is some history, and then unpack each item in
                    // the history as a list item
                    // TODO: Chage this to create a table
                    messagesSent && messagesSent.map( (item, index) => {
                        return <li key={index}>SENT: {item.time} -- [from: {item.fromPhoneNumber}, to: {item.toPhoneNumber}] -- {item.message}</li>
                    })
                }
                </ul>
            <br />
            <h2>Received Message History:</h2>
                <ul>
                {
                    messagesReceived && messagesReceived.map( (item, index) => {
                        return <li key={index}>RECEIVED: {item.time} -- [from: {item.fromPhoneNumber}] -- {item.message}</li>
                    })
                }
                </ul>
            <br />
            <h2>Chat History (Unified)</h2>
                <Chat>
                {
                    (messagesSent || messagesReceived) && sortAndZipperChatHistory(messagesReceived, messagesSent).map( (item, index) => {
                        if (item.type == 'received') {
                            return <ReceivedMessage key={index}>RECEIVED: {item.obj.time} -- [from: {item.obj.fromPhoneNumber}] -- {item.obj.message}</ReceivedMessage>
                        } else {
                            return <SentMessage key={index}>SENT: {item.obj.time} -- [from: {item.obj.fromPhoneNumber}] -- {item.obj.message}</SentMessage>
                        }
                    })
                }
                </Chat>
        </div>
    )
}

export default AdminPanel;