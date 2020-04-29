import React, { useState } from 'react';
import styled from 'styled-components';
import Banner from '../images/banner-1.jpg'

// Axios configuration for backend server is defined here
import client from '../client.js';

const BannerStyle = styled.div`
    overflow: hidden;
    width: 100%;
    height: 600px;
`;

const HomePage = () => {
    return (
        <div>
            <BannerStyle>
                <img src={Banner} />
            </BannerStyle>
            <h1>Welcome to REACH OUT!</h1>
            <p><b>R</b>emote <b>E</b>lderly <b>A</b>ssessment of <b>C</b>are and <b>H</b>ealth (REACH) Out is a system for automating checkins and reminders for the elderly.
                The system is made up of three primary parts. The recurring job system under the "Recurring Job" tab is where you create
                new recurring SMS messages such as reminders to take medications or continual checkins (voice coming soon). You'll find a
                list of the messages sent and how many responses were sent back from that message under the "Dashboard" tab. This lets you
                know at a glance if the person in your care is responsive to your messages or if there may be a problem (rules based alerting
                coming soon). Finally under the "Chat History" tab you will see a log of messages sent and recevied between the system
                and the person under care so you can see the context of their responses.
            </p>
        </div>
    );
}

export default HomePage;