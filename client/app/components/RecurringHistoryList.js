import React, { useMemo } from 'react';
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

const RecurringHistoryList = ({data}) => {
    const columns = useMemo(() => [
        { Header: 'UUID', accessor: 'scheduled_uuid'},
        { Header: 'To', accessor: 'toPhoneNumber'},
        { Header: 'Message', accessor: 'message'},
        { id: Math.random(), Header: 'Enabled', accessor: 'enabled', Cell: (props) => ( props.value ? <Enabled>TRUE</Enabled> : <Disabled>FALSE</Disabled> ) },
        { id: Math.random(), Header: 'Delete', accessor: 'scheduled_uuid', Cell: (props) => ( <button onClick={() => { deleteRecurringJob(props.value) }}>DELETE</button> ) },
    ], []);
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
        <div>
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
    );
}

export default RecurringHistoryList;