import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.post('/send-sms', function(req, res, next) {
    res.send('POST request to /send-sms')
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})


