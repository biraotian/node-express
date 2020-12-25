var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var Admins = mongoose.model('Admins');
var APPID = "wx1b17a0cf69f3f6ee"; //小程序appid
var SECRET = "621369589a7b72b731c9552d7e3c7560"; //小程序appid
/* GET users listing. */
router.get('/', function (req, res, next) {
    var params = {
        "usr": req.query.usr,
        "psw": req.query.psw
    };
    if (req.query.code) {
        var JSCODE = req.query.code;
        var uri = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${JSCODE}&grant_type=authorization_code`;
        request.get(uri, function (err, response) {
            if (err) return next(err);
            params = {
                "usr": "huinian",
                "psw": "YmlyYW90aTEs"
            };
            Admins
                .find(params)
                .exec(function (err, docs) {
                    if (err) return next(err);
                    if (docs.length > 0) {
                        req.session.regenerate(function (err) {
                            if (err) return next(err);
                            //将用户入库
                            request({
                                url: "https://www.shequgou.com.cn/user/register",
                                method: "post",
                                json: true,
                                headers: {
                                    "content-type": "application/json",
                                    "Cookie": req.session.cookie
                                },
                                form: {
                                    "body": response.body
                                }
                            }, (error) => {
                                if (error) return next(error);
                                //返回结果
                                return res.json({
                                    "res": response,
                                    "status": 200,
                                    "data": "登陆成功"
                                });
                            });
                        });
                    } else {
                        return res.json({
                            "docs": docs,
                            "status": 201,
                            "data": "登陆失败"
                        });
                    }
                });
        })
    } else {
        Admins
            .find(params)
            .exec(function (err, docs) {
                if (err) return next(err);
                if (docs.length > 0) {
                    req.session.regenerate(function (err) {
                        if (err) return next(err);
                        return res.json({
                            "status": 200,
                            "data": "登陆成功"
                        });
                    });
                } else {
                    return res.json({
                        "status": 201,
                        "data": "登陆失败"
                    });
                }
            });
    }
});
router.get('/exit', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            return res.json({
                "status": 201,
                "data": "退出失败"
            });
        } else {
            return res.json({
                "status": 200,
                "data": "退出成功"
            });
        }
    });
});
module.exports = router;