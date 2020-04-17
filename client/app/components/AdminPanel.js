import React, { useState, useEffect } from 'react';

// Axios configuration for backend server is defined here
import client from '../client.js';

const AdminPanel = () => {
    const [history, setHistory] = useState(null);

    const getSmsHistory = async () => {
        const response = await client.get('/message-history');
        setHistory(response.data);
    }

    // The useEffect hook will re-execute (and I believe re-render the component)
    // whenever one of the values in the second parameter changes. Since the second
    // parameter is an empty array, it will be run exactly once when the component
    // loads
    useEffect(() => { getSmsHistory() }, []);

    return(
        <div>
            <h1>Admin Panel Page</h1>
            <h2>Sent Message History:</h2>
                <ul>
                {
                    // Check that there is some history, and then unpack each item in
                    // the history as a list item
                    // TODO: Chage this to create a table
                    history && history.map( (item, index) => {
                        return <li key={index}>{item.time} -- [from: {item.fromPhoneNumber}, to: {item.toPhoneNumber}] -- {item.message}</li>
                    })
                }
                </ul>
            <h2>Scheduled Job List:</h2>
            <p>TODO</p>
        </div>
    )
}

export default AdminPanel;