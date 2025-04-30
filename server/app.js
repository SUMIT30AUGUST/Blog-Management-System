const express = require('express')
const app = express()
require('./dbConfig')
const cors = require("cors");
const path = require('path');
const Router = require('./Router/Routes');
require('dotenv').config()

const PORT = process.env.PORT || 5000

app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/files', express.static(path.join(__dirname, "files")))
app.use('/public', express.static(path.join(__dirname, "public")))
app.use('/api', Router);


app.listen(PORT, () => {
    console.log(`App listening port : ${PORT}`)
})
