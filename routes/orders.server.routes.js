var express = require('express');
require('async');
var router = express.Router();

var mongoose = require('mongoose');
var Orders = mongoose.model('Orders');
var Products = mongoose.model('Products'); //产品模型
var ProductUsers = mongoose.model('ProductUsers'); //生成购买记录模型

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;
    
    var orderby = "";
    var a = {},
        b = {},
        c = {
            "isHide":false
        };
    if (req.query.openid) {
        a = {
            "openid": req.query.openid
        }
    }
    if (req.query.ranking) {
        var endTime = new Date(rt.getNowFormatDate('string')).getTime();
        var startTime = new Date(endTime - 7 * 24 * 3600 * 1000).getTime();
        b = {
            "$and": [{
                createTime: {
                    "$gte": startTime,
                    "$lte": endTime
                }
            }]
        }
    }
    if (req.query.sort == 1) {
        orderby = {
            "_id": -1
        }
    }
    Orders
        .find(Object.assign(a, b, c))
        .exec(function (err, docs) {
            if (err) return new Error(err);
            pages = Math.ceil(docs.length / pagesize);
            Orders
                .find(Object.assign(a, b, c))
                .sort(orderby)
                .skip((pagestart - 1) * pagesize)
                .limit(pagesize)
                .exec(function (err, docs) {
                    if (err) return next(new Error("操作失败"));
                    return rt.list(req, res, next, err, docs, pagestart, pages);
                });
        });
});
router.post('/create', function (req, res, next) {
    var orders = new Orders(req.body);
    orders.save(function (err, doc) {
        if (err) return next(err);
        return rt.message(req, res, next, err, doc);
    });
});
router
    .get('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Orders
            .findOne({
                "_id": req.params.id
            })
            .exec(function (err, doc) {
                if (err) return next(new Error("操作失败"));
                return rt.list(req, res, next, err, doc);
            })
    })
    .post('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Orders
            .updateOne({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(err);
                //这里开始生成用户购买记录
                Orders
                    .findOne({
                        "_id": req.params.id
                    })
                    .exec(function (err, doc) {
                        if (err) return next(new Error("操作失败"));
                        for (var i = 0; i < doc.pList.length; i++) {
                            var order = doc.pList[i];
                            var item = {
                                "pid": order.id,
                                "count": order.count,
                                "userInfo": doc.userInfo
                            };
                            var productusers = new ProductUsers(item);
                            productusers
                                .save(function (err) {
                                    if (err) return next(err);
                                    return;
                                });
                        }
                    });
                return rt.update(req, res, next, err, row);
            })
    })
    .delete('/detail/:id',function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Orders
            .findOneAndUpdate({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(err);
                return rt.update(req, res, next, err, row);
            })
    });

module.exports = router;