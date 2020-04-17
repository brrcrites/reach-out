import React from 'react';

const RecurringHistoryListItem = ({data}) => {

    return (
        <li key={data.scheduled_uuid}>[{data.scheduled_uuid}] <b>toNumber:</b> {data.toPhoneNumber} | <b>message:</b> {data.message} | <b>recurring:</b> {JSON.stringify(data.recurring)}</li>
    );
}

export default RecurringHistoryListItem;