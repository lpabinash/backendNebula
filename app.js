const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv/config')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads/', express.static('uploads'))

require('./App/routes/music.route')(app);

    mongoose.connect(process.env.DB_CONNECTION,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        dbName:"music"
    }).then(()=>{
        console.log("successfully connected to the database");
    }).catch(err =>{
        console.log("could not connect to database");
        process.exit();
    })
  

app.use((req, res, next) => {
    res.status(200).json({
        message: "It works"
    });
})



module.exports = app;