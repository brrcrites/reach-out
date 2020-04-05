FROM node:latest

WORKDIR /code

COPY . .

RUN npm install
RUN npm run build

CMD ["npm","run","start"]
EXPOSE 8080
