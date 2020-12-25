var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Tels = mongoose.model('Tels');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;
    var pages = 1;
    var orderby = "";
    var a = {};
    if (req.query.state) {
        a = {
            "state": req.query.state
        }
    }
    if (req.query.sort == 1) {
        orderby = {
            "_id": -1
        }
    }
    Tels
        .find(a)
        .exec(function (err, docs) {
            if (err) return new Error(err);
            pages = Math.ceil(docs.length / pagesize);
            Tels
                .find(a)
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
    var tels = new Tels(req.body);
    tels.save(function (err, doc) {
        if (err) return next(new Error("操作失败"));
        return rt.message(req, res, next, err, doc);
    })
});
router
    .get('/detail/:id', function (req, res, next) {
        return new Error("不支持此接口");
    })
    .post('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Tels
            .updateOne({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(new Error("操作失败"));
                return rt.update(req, res, next, err, row);
            })
    })
    .delete('/manage/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Tels
            .findByIdAndRemove(req.params.id, function (err, docs) {
                if (err) return next(err);
                return rt.message(req, res, next, err, docs);
            })
    });
module.exports = router;