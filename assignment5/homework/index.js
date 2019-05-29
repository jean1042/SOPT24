var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var newsRouter = require('./news');
var imgsRouter = require('./news');

var app = express();

// view engine setup
app.set('/news', newsRouter);
app.use('/news',newsRouter);

app.set('/news/thumbnail',imgsRouter);
app.use('/news/thumbnail',imgsRouter);

module.exports = app;


