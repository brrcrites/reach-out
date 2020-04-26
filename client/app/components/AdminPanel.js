import React, { useState, useEffect } from 'react';

// Axios configuration for backend server is defined here
import client from '../client.js';

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

    while (receivedSorted.length && sentSorted.length) {
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
    while (receivedSorted.length) {
        generatedReturn = generatedReturn.concat({ 'type': 'received', 'obj': receivedSorted[0] });
        receivedSorted.shift();
    }
    while (sentSorted.lenght) {
        generatedReturn = generatedReturn.concat({ 'type': 'sent', 'obj': sentSorted[0] });
        sentSorted.shift();
    }

    return generatedReturn;
}

const AdminPanel = () => {
    const [messagesSent, setMessagesSent] = useState(null);
    const [messagesReceived, setMessagesReceived] = useState(null);
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
                <ul>
                {
                    (messagesSent || messagesReceived) && sortAndZipperChatHistory(messagesReceived, messagesSent).map( (item, index) => {
                        if (item.type == 'received') {
                            return <li key={index}>RECEIVED: {item.obj.time} -- [from: {item.obj.fromPhoneNumber}] -- {item.obj.message}</li>
                        } else {
                            return <li key={index}>SENT: {item.obj.time} -- [from: {item.obj.fromPhoneNumber}] -- {item.obj.message}</li>
                        }
                    })
                }
                </ul>
        </div>
    )
}

export default AdminPanel;