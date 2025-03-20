const express = require('express');
const mongoose = require('mongoose');


const connectDB = require('./config/db');

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.status(200);
    res.send('Hello World');

}
);
connectDB().then(() => {
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
}
);