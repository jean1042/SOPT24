var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var newsRouter = require('./news');

var app = express();

// view engine setup
app.set('/homework/news', newsRouter);
app.use('/homework/news',newsRouter);

module.exports = app;


