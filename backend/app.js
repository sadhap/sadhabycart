const express = require('express');
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error');
const path = require('path');
const dotenv = require('dotenv');//import the dotenv from node_modules

dotenv.config({path:path.join(__dirname,"config/config.env")});//export the environment

const app = express();//object....method
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
const products =require("./routes/product")//import the routs
const auth = require("./routes/auth");
const order= require("./routes/order");
const payment = require('./routes/payment')
app.use("/api/v1/",products);
app.use("/api/v1/",auth);
app.use("/api/v1/",order);
app.use("/api/v1/",payment);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

app.use(errorMiddleware); 

module.exports = app;  //export the app .....>express 