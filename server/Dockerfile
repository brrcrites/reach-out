#ARG PORT=8081
FROM node:latest

WORKDIR /code
#ARG PORT
#ENV port $PORT

# Copy in package.json and install so it can cache the npm package layer
COPY package.json .
RUN npm install

# Copy in server code after and build since this is likely to change often
COPY . .
RUN npm run build

RUN npm install -g twilio-cli
RUN echo ${TWILIO_SMS_NUMBER}
RUN twilio phone-numbers:update ${TWILIO_SMS_NUMBER} --sms-url=http://localhost:${PORT}/sms-reponse
CMD ["npm","run","start"]
EXPOSE $PORT
