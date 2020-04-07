FROM node:latest

WORKDIR /code

# Copy in package.json and install so it can cache the npm package layer
COPY package.json .
RUN npm install

# Copy in server code after and build since this is likely to change often
COPY . .
RUN npm run build

CMD ["npm","run","start"]
EXPOSE 8080
