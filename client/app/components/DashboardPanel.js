import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTable, useRowSelect } from 'react-table';

// Axios configuration for backend server is defined here
import client from '../client.js';

// Source: https://codepen.io/samuelkraft/pen/Farhl
// Source: https://leaverou.github.io/bubbly/
// Source: https://codepen.io/swards/pen/gxQmbj

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
`

function compareByTimestamp(a, b) {
    if (a.time < b.time) {
        return -1;
    }
    if (a.time > b.time) {
        return 1;
    }
    return 0;
}

function curateMessageData(messagesSent,messagesReceived) {
    let j = 0;
    return messagesSent.map((item,i) => {
        item.responsesStart = j;
        let responses = 0;
        while (j < messagesReceived.length && messagesReceived[j].time > item.time) {
            responses++;
            j++;
        }
        return {
            to: item.toPhoneNumber,
            time: item.time,
            message: item.message,
            responses: responses
        }
    });
}

const DashboardPanel = () => {
    const [messagesSent, setMessagesSent] = useState([]);
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [messageData, setMessageData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const columns = React.useMemo(() => [
        { Header: 'To', accessor: 'to', },
        { Header: 'Time', accessor: 'time', },
        { Header: 'Message', accessor: 'message', },
        { Header: 'Responses', accessor: 'responses', }],[]);
    const data = React.useMemo(() => curateMessageData(messagesSent,messagesReceived),
        [messagesSent,messagesReceived]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable( { columns,data, } );

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

    return (
        <div>
        <h1>Dashboard</h1>
        <Styles>
        <table {...getTableProps()}> 
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                     {headerGroup.headers.map(column => (
                         <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                     ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row,i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>{row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </Styles>
        </div>
    )
}

export default DashboardPanel;
