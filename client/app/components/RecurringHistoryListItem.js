import React from 'react';
import styled from 'styled-components';
import { useTable } from 'react-table'

// Axios configuration for backend server is defined here
import client from '../client.js';

const Enabled = styled.span`
    color: green;
`;

const Disabled = styled.span`
    color: red;
`;

const Styles = styled.div`
    padding: 1rem;
     
    table {
        border-spacing: 0;
        border: 1px solid black;

        tr {
            :last-child {
                td {
                    border-bottom:0;
                }
            }
        }
        th, td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid black;
            border-right: 1px solid black;

            :last-child {
                border-right: 0;
            }
        }
    }
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

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

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