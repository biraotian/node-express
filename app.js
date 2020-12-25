var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser("huinian"));
app.use(bodyParser.json());
//schedule
// require('./node-schedule');
/**
 * import mongoose
 */
var mongoose = require("./config/mongoose");
var db = mongoose();
/**
 * import redis
 */
var redisClient = require("./config/redis");
var RedisStore = require('connect-redis')(session);
app.use(session({
    name: 'SESSIONID',
    secret: 'HUINIAN',
    store: new RedisStore({
        client: redisClient
    }),
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000
    },
    saveUninitialized: false,
    resave: false
}));
//session Interceptor
app.use(function (req, res, next) {
    if (req.originalUrl.indexOf("/login") < 0) {
        if (!req.session || !req.sessionID) {
            return next(new Error("你无权查看此API"));
        }
        if (req.sessionID) {
            if (!redisClient.exists('sess:' + req.sessionID)) {
                return next(new Error("SESSION无效或过期"));
            }
        }
    }
    next();
});
//static list
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/user', require('./routes/users.server.routes'));
app.use('/area', require('./routes/areas.server.routes'));
app.use('/shop', require('./routes/shops.server.routes'));
app.use('/tel', require('./routes/tels.server.routes'));
app.use('/product', require('./routes/products.server.routes'));
app.use('/productusers', require('./routes/product-users.server.routes'));
app.use('/order', require('./routes/orders.server.routes'));
app.use('/uploadimges', require('./routes/uploadimages.server.routes'));
app.use('/ranking', require('./routes/ranking.server.routes'));
app.use('/login', require('./routes/login.server.routes'));
app.use('/coupon', require('./routes/coupon.server.routes'));
app.use('/getappinfo', require('./routes/appinfo.server.routes'));
app.use('/codes', require('./routes/taobao-codes.server.routes'));
app.use('/getstatus', require('./routes/getstatus.server.routes'));
app.use('/lose', require('./routes/lose.server.routes'));
app.use('/custom', require('./routes/custom.server.routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;