ARG PORT=8080
FROM node:latest

WORKDIR /code
ARG PORT
ENV port $PORT

# Copy in package.json and install so it can cache the npm package layer
COPY package.json .
RUN npm install

# Copy in client code after and build since this is likely to change often
COPY . .
RUN npm run build

CMD ["npm","run","start"]
EXPOSE $PORT
