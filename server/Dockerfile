FROM node:latest

WORKDIR /code
ARG TWILIO_SMS_NUMBER
ARG PORT

# Copy in package.json and install so it can cache the npm package layer
COPY package.json .
RUN npm install

# Copy in server code after and build since this is likely to change often
COPY . .
RUN npm run build
RUN npm install -g twilio-cli

CMD ["npm","run","start"]
EXPOSE $PORT
