var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Areas = mongoose.model('Areas');

//导入redis
var redisClient = require("../config/redis");

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    
});
module.exports = router;