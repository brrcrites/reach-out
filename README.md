# REACH OUT
**R**emote **E**lder **A**ssessment of **C**are and **H**ealth 

## Description

Are you worried about your parents or grandparents keeping up with their medication and staying healthy during this time? Would you want to still come check on them if it wouldn't expose them to increased risk of infection? With this application you are able to schedule reminder text messages to be sent to check-in on how someone is doing, or remind them to take their medication or their temperature to monitor their symptoms. Of course, a calendar event reminder can do the same, but how many of your parents or grandparents would use that? And wouldn't they prefer the personal touch of a text message from a loved one, albeit automated?

## Stack

- **M**ongoDB
- **E**xpress
- **R**eact
- **N**odeJS
- Twilio API

## Development

Slack channel for communication, GitHub Projects Kanban board, docker-compose and Docker containers for development and Jest for testing with TravisCI for continuous integration. 

## Using docker-compose

### Requirements

* Docker
* docker-compose
* twilio-cli

### Running in development

* `$ twilio phone-numbers:update <sms_number> --sms-url=http://localhost:<port>/sms-response`
Where `<sms_number>` is your twilio registered number and `<port>` is the exposed port from your `.env` file (for the server not the client)
The service will be running in the background, open a new terminal, navigate to your project directory and type:
* `$ docker-compose -f docker-compose.dev.yml up --build`
This will launch your container(s) for development. Once you are done
* `Ctrl-c`
* `docker-compose -f docker-compose.dev.yml down`
And don't forget to `Ctrl-c` to close the `ngrok` tunnel to your local machine in the other terminal. 

### Environment Variables

Add these values to a `server/.env` file. See `.env.example` for the values needed. 
 - `PORT`: The port the server docker container will be exposed on (i.e. 8081)
 - `TWILIO_SMS_NUMBER`: Your twilio SMS number
 - `TWILIO_ACCOUNT_SID`: Your twilio account SID
 - `TWILIO_AUTH_TOKEN`: Your twilio authorization token
 - `MONGO_HOSTNAME`: The name of your Mongo server
 - `MONGO_PORT`: The port your Mongo docker container will be exposed on (i.e. 27017)
 - `MONGO_DB`: The name of your MongoDB

# Notes for Users

* Currently the pages do not reload when you submit a form. In order to reload the data that is presented on a page you will need to navigate away from the page and back to it (clicking the navbar for the page you are already on will not reload the page)
