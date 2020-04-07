ARG PORT=8081
FROM node:latest

WORKDIR /code
ARG PORT
ENV port $PORT

COPY package.json . 
RUN npm install

COPY . .

RUN npm run build
CMD ["npm","run","start"]
EXPOSE $PORT
