require('dotenv').config();
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewURLParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var indexRouter = require('./routes/index');
var postRouter = require('./routes/posts')
var userRouter = require('./routes/users');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

module.exports = app;
