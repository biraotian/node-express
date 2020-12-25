var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Users = mongoose.model('Users');

var rt = require('./rt.interceptor');
/* GET users listing. */
router.post('/register', function (req, res, next) {
    var openid = JSON.parse(req.body.body).openid;
    var users = new Users({
        "openid": openid
    });
    Users
        .find({
            "openid": openid
        })
        .exec(function (err, docs) {
            if (err) return next(err);
            if (docs.length <= 0) {
                users.save(function (err, doc) {
                    return rt.message(req, res, next, err, doc);
                });
            } else {
                return res.json({
                    "status": 200,
                    "data": "这个用户已经注册过了"
                });
            }
        });
});
router.get('/info', function (req, res, next) {
    var openid = req.query.openid;
    if (!openid) {
        Users
            .find()
            .exec(function (err, docs) {
                if (err) return next(err);
                return res.json({
                    "status": 200,
                    "userNumber": docs.length
                });
            });
    } else {
        Users
            .find({
                "openid": openid
            })
            .exec(function (err, docs) {
                if (err) return next(err);
                if (docs.length > 0 && docs[0].userInfo != "") {
                    return res.json({
                        "status": 200,
                        "userInfo": docs[0].userInfo,
                        "phone":docs[0].phone,
                        "wx_id":docs[0].wx_id,
                    });
                } else {
                    return res.json({
                        "status": 201,
                        "data": "没有查到此用户信息"
                    });
                }
            });
    }
});
router.post('/set', function (req, res, next) {
    var openid = req.query.openid;
    if (!openid) return next(new Error("没有传openid"));
    Users
        .updateOne({
            "openid": openid
        }, req.body, function (err, row) {
            if (err) return next(new Error("操作失败"));
            return rt.update(req, res, next, err, row);
        })
});
module.exports = router;