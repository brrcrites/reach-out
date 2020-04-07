ARG PORT=8081
FROM node:latest

WORKDIR /code
ARG PORT
ENV port $PORT

COPY . .

RUN npm install
RUN npm run build

CMD ["npm","run","start"]
EXPOSE $PORT
