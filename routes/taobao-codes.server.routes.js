var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var TaobaoCodes = mongoose.model('TaobaoCodes');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    var key = req.query.key || "";
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;
    var pages = 1;
    if (!key) {
        TaobaoCodes
            .find()
            .exec(function (err, docs) {
                if (err) return next(err);
                pages = Math.ceil(docs.length / pagesize);
                TaobaoCodes
                    .find()
                    .skip((pagestart - 1) * pagesize)
                    .limit(pagesize)
                    .exec(function (err, docs) {
                        return rt.list(req, res, next, err, docs, pagestart, pages);
                    })
            });
    } else {
        TaobaoCodes
            .find({
                $or: [{
                    code: {
                        $regex: key
                    }
                }]
            })
            .exec(function (err, docs) {
                return rt.list(req, res, next, err, docs);
            })
    }
});
router.post('/create', function (req, res, next) {
    var taobaocodes = new TaobaoCodes(req.body);
    taobaocodes.save(function (err) {
        return rt.message(req, res, next, err, taobaocodes);
    })
});
router.post('/edit/:id', function (req, res, next) {
    TaobaoCodes
        .findOneAndUpdate({
            "_id": req.params.id
        }, req.body, function (err, row) {
            if (err) return next(new Error("操作失败"));
            return rt.update(req, res, next, err, row);
        });
});
router
    .get('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        TaobaoCodes
            .findOne({
                "_id": req.params.id
            })
            .exec(function (err, doc) {
                return rt.list(req, res, next, err, doc);
            })
    })
    .post('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        if (req.body.addlike) {
            TaobaoCodes
                .findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $inc: {
                        like: 1
                    }
                }, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                });
        } else if (req.body.addView) {
            TaobaoCodes
                .findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $inc: {
                        view: 1
                    }
                }, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                });
        } else {
            return next(new Error("参数错误"))
        }
    });

module.exports = router;