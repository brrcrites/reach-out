'use strict';

const mongoose = require('mongoose')
const dotenv = require('dotenv');

// Mongoose options
const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: false,
    poolSize: 10,
    bufferMaxEntries: 0
};

// MongoDB environment variables
const {
    MONGO_HOSTNAME,
    MONGO_DB,
    MONTO_PORT
} = process.env;

const dbConnectionURL = {
    'LOCALURL': `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`
};
mongoose.connect(dbConnectionURL.LOCALURL,options);
const db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB Connection Error:'+dbConnectionURL.LOCALURL));
db.once('open', () => {
    // We're connected!
    console.log('MongoDB Connection Successful');
});

