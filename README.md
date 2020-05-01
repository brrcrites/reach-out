# REACH Out

[![Build Status](https://travis-ci.com/brrcrites/twilio-dev-hack.svg?branch=master)](https://travis-ci.com/brrcrites/twilio-dev-hack)

**R**emote **E**lder **A**ssessment of **C**are and **H**ealth 

## Description

Are you worried about your parents or grandparents keeping up with their medication and staying healthy during this time? Would you want to still come check on them if it wouldn't expose them to increased risk of infection? With this application you are able to schedule reminder text messages to be sent to check-in on how someone is doing, or remind them to take their medication or their temperature to monitor their symptoms. Of course, a calendar event reminder can do the same, but how many of your parents or grandparents would use that? And wouldn't they prefer the personal touch of a text message from a loved one, albeit automated?

## Stack

- **M**ongoDB
- **E**xpressJS
- **R**eact
- **N**odeJS
- Twilio API
- Docker & docker-compose

## Setup

### Requirements

Make sure you have the following installed:
* [Docker](https://docs.docker.com/get-docker/)
* [docker-compose](https://docs.docker.com/compose/install/)
* [twilio-cli](https://www.twilio.com/docs/twilio-cli/quickstart)

### Running Locally

* If you haven't already, [install the twilio cli tool and login using your twilio credentials](https://www.twilio.com/docs/twilio-cli/quickstart). Make sure your account has at least one valid number for receiving and sending sms messages (use this number below when `<twilio_number>` is referenced)

* Add these values to a `server/.env` file. You can make a copy of the provided `server/.env.example` file and modify it with your twilio information to use the default deployment

  * `TWILIO_SMS_NUMBER`: Your twilio sms number, `<twilio_number>`
  * `TWILIO_ACCOUNT_SID`: Your twilio account SID, which you can get from the twilio console
  * `TWILIO_AUTH_TOKEN`: Your twilio authorization token, whcih you can get from the twilio console
  * `PORT`: The port the server docker container will be exposed on (8081 using the default setup)
  * `MONGO_HOSTNAME=mongo`: The name of your Mongo server (`mongo` using the default setup)
  * `MONGO_PORT=27017`: The port your Mongo docker container will be exposed on (27017 using the default setup)
  * `MONGO_DB=reach-out-db`: The name of your MongoDB (`reach-out-db` using the default setup)

* Run the following command, `twilio phone-numbers:update <twilio_number> --sms-url=http://localhost:8081/sms-response`, so incoming messages to your twilio number will make a reqest to your web server. This uses ngrok under the hood to create a tunnel to your local machine, so make sure to keep this command running as you continue through the next steps are test the app (or run it as a background process)

> Note: The 8081 port above assumes you are using the default deployment and should be changed if you change the server port

* In a new terminal run the following command from the project root, `docker-compose -f docker-compose.dev.yml up --build`, which will re-build the containers and launch the app. It will take a moment for docker to re-build and deploy the app, but it should be ready if you have the following lines in your output:

```
myapp_server     | MongoDB Connection Successful
...
myapp_client     | ℹ ｢wdm｣: Compiled successfully.
```

* When you are done using the app, use `Ctrl-c` to stop the containers followed by the command `docker-compose -f docker-compose.dev.yml down` to tear down the docker infrastructure. You can then kill the twilio cli process which will close the tunnel to your local machine

## Notes

### For Users

* Currently the pages do not reload when you submit a form and cannot be reloaded by refreshing the page. In order to reload the data that is presented on a page you will need to navigate away from the page and back to it (clicking the navbar for the page you are already on will not reload the page)
* This system has not been reviewed for any type of compliance (HIPPA, FERPA, etc.) and should not be used for conversations protected by any government regulations
* All times for recurring jobs can be entered in the local timezone, but must be entered in military time (So 10:07 PM would be 22:07)
* The times entered are presently being converted to UTC so they are sent at the correct time accounting for timezone, however this can cause issues (especially when testing) as the 7 hour offset may mean it misses firing the event for the day it is logged

### For Developers

* There is no hot-reloading when developing with docker containers. Exit the container, run `docker-compose down` then start-up the container again once changes have been made. Can run `docker-compose -f <dockercomposefile> up --build && docker-compose -f <dockercomposefile> down` to bring down the containers once they've been exited with ctrl-C.
* The recurring jobs to not reload from the DB. Once you bring down the development server those jobs will still be in the DB but won't reload into the cron job when you bring up a new container. 
* There are curently only tests to make sure that the docker containers build without any failures (run by Travis CI) and for the server. The server tests can be run with `npm run test` in the `/server` directory

# Authors

This project was created by [Brian Crites](https://github.com/brrcrites) and [Jeffrey McDaniel](https://github.com/jmcda001) with special thanks to [Andrew Lvovsky](https://github.com/borninla) for his testing support.
