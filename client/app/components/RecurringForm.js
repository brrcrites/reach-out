import React, { useState, useEffect } from 'react';
import RecurringHistoryList from './RecurringHistoryList.js';
import styled from 'styled-components';

const Padding = styled.div`
    padding: 10px;
`;

const Flex = styled.div`
    display: flex;
    padding: 10px;
`;

// Axios configuration for backend server is defined here
import client from '../client.js';

function daysToDayRange(monday, tuesday, wednesday, thursday, friday, saturday, sunday) {
    var dayRange = []
    if (sunday) {
        dayRange.push(0);
    }
    if (monday) {
        dayRange.push(1);
    }
    if (tuesday) {
        dayRange.push(2);
    }
    if (wednesday) {
        dayRange.push(3);
    }
    if (thursday) {
        dayRange.push(4);
    }
    if (friday) {
        dayRange.push(5);
    }
    if (saturday) {
        dayRange.push(6);
    }
    return dayRange;
}

// TODO: The days of the week need to be pre-processed or something, this is way too many params
function createRecurringJob(toNumber, message, type, hour, minute, monday, tuesday, wednesday, thursday, friday, saturday, sunday, setResponse) {
    // TODO: This gives us a date object based on today with the time requested and then we pull out the UTC portions
    // when sending it to the backend because cron seems to run on a UTC clock. This feels really bad and probably wont
    // stand up to things like daylight savings so we will need to fix it somehow
    const now = new Date();
    const dataDate = new Date(now.getFullYear(), now.getMonth(), now.getDay(), parseInt(hour), parseInt(minute));

    // Create payload for POST
    // TODO: Right now we validate number entires using regex but its a bit unintuitive, how/where to validate user input
    // TODO: This doesn't account for timezone offsets, and the backend should probably always be in UTC
    var data = JSON.stringify({
        toNumber: toNumber,
        message: message,
        type: type,
        hour: dataDate.getUTCHours(),
        minute: dataDate.getUTCMinutes(),
        dayOfWeek: daysToDayRange(monday, tuesday, wednesday, thursday, friday, saturday, sunday)
    });
   console.log(`payload data: ${data}`)

   // Post the request to have the sms sent
   client.post('/recurring-create', data, { headers: { 'Content-Type': 'application/json' } })
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

const RecurringForm = () => {
    const [toNumber, setToNumber] = useState('+1');
    const [message, setMessage] = useState('This is a default test message');
    const [hour, setHour] = useState('09');
    const [minute, setMinute] = useState('00')
    const [mondaySelected, setMondaySelected] = useState(false);
    const [tuesdaySelected, setTuesdaySelected] = useState(false);
    const [wednesdaySelected, setWednesdaySelected] = useState(false);
    const [thursdaySelected, setThursdaySelected] = useState(false);
    const [fridaySelected, setFridaySelected] = useState(false);
    const [saturdaySelected, setSaturdaySelected] = useState(false);
    const [sundaySelected, setSundaySelected] = useState(false);
    const [type, setType] = useState('sms')
    const [response, setResponse] = useState('No Message');
    const [history, setHistory] = useState([]);

    const hourRE = /^[0-2]?[0-9]?$/;
    const minuteRE = /^[0-5]?[0-9]?$/;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // TODO: We need to re-use this type of functionality on each page that loads when when the page loads
    async function loadData() {
        try {
            setLoading(true);
            // TODO: This has been set to only return enabled jobs (which might be fine) and only return those
            // that are currently loaded into the recurring job system cache. Follow this to the server and into
            // the recurring job system to find the monkey patch
            const response = await client.get('/recurring-list?all=false');
            console.log(response);
            setHistory(response.data);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    if (loading) { return (<h1>LOADING</h1>); }
    return (
        <Padding>
            <h1>Recurring Page</h1>
            <h2>Create New Recurring Message Job</h2>
            <p>Note: Using the debug option will print a console.log on the server when the cron triggers for testing purposes. The SMS option will send an actual text message</p>
            <form onSubmit={ 
                (event) => { 
                    event.preventDefault(); 
                    createRecurringJob(
                        toNumber, 
                        message,
                        type,
                        hour, 
                        minute, 
                        mondaySelected, 
                        tuesdaySelected, 
                        wednesdaySelected, 
                        thursdaySelected, 
                        fridaySelected, 
                        saturdaySelected, 
                        sundaySelected,
                        setResponse
                    );
                }
            }>
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
                <label>
                    Time:
                    <input
                        type="text"
                        value={hour}
                        onChange={ (e) => { if(hourRE.test(e.target.value)) { setHour(e.target.value); }}}
                    />
                    <input
                        type="text"
                        value={minute}
                        onChange={ (e) => { if(minuteRE.test(e.target.value)) { setMinute(e.target.value); }}}
                    />
                </label>
                <Flex>
                    <label>
                        Monday:
                        <input
                            name="monday"
                            type="checkbox"
                            checked={mondaySelected}
                            onChange={ (e) => { setMondaySelected(!mondaySelected) }}
                        />
                    </label>
                    <label>
                        Tuesday:
                        <input
                            name="tuesday"
                            type="checkbox"
                            checked={tuesdaySelected}
                            onChange={ (e) => { setTuesdaySelected(!tuesdaySelected) }}
                        />
                    </label>
                    <label>
                        Wednesday:
                        <input
                            name="wednesday"
                            type="checkbox"
                            checked={wednesdaySelected}
                            onChange={ (e) => { setWednesdaySelected(!wednesdaySelected) }}
                        />
                    </label>
                    <label>
                        Thursday:
                        <input
                            name="thursday"
                            type="checkbox"
                            checked={thursdaySelected}
                            onChange={ (e) => { setThursdaySelected(!thursdaySelected) }}
                        />
                    </label>
                    <label>
                        Friday:
                        <input
                            name="friday"
                            type="checkbox"
                            checked={fridaySelected}
                            onChange={ (e) => { setFridaySelected(!fridaySelected) }}
                        />
                    </label>
                    <label>
                        Saturday:
                        <input
                            name="saturday"
                            type="checkbox"
                            checked={saturdaySelected}
                            onChange={ (e) => { setSaturdaySelected(!saturdaySelected) }}
                        />
                    </label>
                    <label>
                        Sunday:
                        <input
                            name="sunday"
                            type="checkbox"
                            checked={sundaySelected}
                            onChange={ (e) => { setSundaySelected(!sundaySelected) }}
                        />
                    </label>
                </Flex>
                <select id="type" name="type" value={type} onChange={ (e) => { setType(e.target.value) }}>
                    <option value="debug">Debug</option>
                    <option value="sms">SMS</option>
                    { 
                        // TODO: Not yet implemented so commented out for twilio hackathon
                        /* <option value="voice">Voice</option> */ 
                    }
                </select>
                <br />
                <input type="submit" value="Submit" />
            </form>
            <div>
                <h2>Recurring Jobs</h2>
                { (history.length > 0) ? <RecurringHistoryList data={history} /> : 'No Recurring Jobs Created' } 
            </div>
        </Padding>
    );
}

export default RecurringForm;