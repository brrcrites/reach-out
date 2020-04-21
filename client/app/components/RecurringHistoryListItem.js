import React from 'react';
import styled from 'styled-components';

// Axios configuration for backend server is defined here
import client from '../client.js';

const Enabled = styled.span`
    color: green;
`;

const Disabled = styled.span`
    color: red;
`;

function deleteRecurringJob(uuid) {
    console.log(`uuid: ${uuid}`)

    var data = JSON.stringify({
        uuid: uuid
    });

   client.post('/recurring-delete', data, { headers: { 'Content-Type': 'application/json' } })
   // Handle success case
   .then( (response) => {
       console.log(response);
   })
   // Handle failure case
   .catch( (response) => {
       console.error(response);
   });
}

const RecurringHistoryListItem = ({data}) => {
    const enabledText = data.enabled ? <Enabled>TRUE</Enabled> : <Disabled>FALSE</Disabled>;
    console.log(data.enabled);

    return (
        <li key={data.scheduled_uuid}>
            <b>UUID:</b> {data.scheduled_uuid}
            <br/>
            <b>toNumber:</b> {data.toPhoneNumber}
            <br/>
            <b>message:</b> {data.message}
            <br/>
            <b>recurring:</b> {JSON.stringify(data.recurring)}
            <br/>
            <b>enabled:</b> {enabledText}
            <br/>
            { data.enabled && <button onClick={() => { deleteRecurringJob(data.scheduled_uuid) }}>DELETE</button> }
        </li>
    );
}

export default RecurringHistoryListItem;