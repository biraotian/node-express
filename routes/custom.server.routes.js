var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Customs = mongoose.model('Customs');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;
    var pages = 1;
    var orderby = ""
    if (req.query.sort == 1) {
        orderby = {
            "_id": -1
        }
    }
    Customs
        .find({
            "type": req.query.type
        })
        .exec(function (err, docs) {
            if (err) return new Error(err);
            pages = Math.ceil(docs.length / pagesize);
            Customs
                .find({
                    "type": req.query.type
                })
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
    var customs = new Customs(req.body);
    customs.save(function (err, doc) {
        if (err) return next(new Error("操作失败"));
        return rt.message(req, res, next, err, doc);
    })
});
router
    .get('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Customs
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
        Customs
            .updateOne({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(new Error("操作失败"));
                return rt.update(req, res, next, err, row);
            })

    });

module.exports = router;