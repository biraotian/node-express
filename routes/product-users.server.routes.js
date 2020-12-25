var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ProductUsers = mongoose.model('ProductUsers');

var rt = require('./rt.interceptor');

router
    .get('/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        console.log(req.params);
        ProductUsers
            .find({
                "pid": req.params.id
            })
            .limit(20)
            .exec(function (err, docs) {
                if (err) return next(new Error("操作失败"));
                return rt.list(req, res, next, err, docs);
            })
    })
    .post('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        ProductUsers
            .updateOne({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(new Error("操作失败"));
                return rt.update(req, res, next, err, row);
            })

    });

module.exports = router;