# twilio-dev-hack
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