var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Areas = mongoose.model('Areas');
var News = mongoose.model('News');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    let pagesize = parseInt(req.query.pagesize, 10) || 10;
    let pagestart = parseInt(req.query.pagestart, 10) || 1;
    Areas
        .find()
        .skip((pagestart - 1) * pagesize)
        .limit(pagesize)
        .exec(function (err, docs) {
            if (err) return next(new Error("操作失败"));
            return rt.list(req, res, next, err, docs);
        })
});
router.post('/create', function (req, res, next) {
    let areas = new Areas(req.body);
    areas.save(function (err, doc) {
        if (err) return next(new Error("操作失败"));
        return rt.message(req, res, next, err, doc);
    })
});
router
    .get('/notice', function (req, res, next) {
        let pagesize = parseInt(req.query.pagesize, 10) || 10;
        let pagestart = parseInt(req.query.pagestart, 10) || 1;
        let pages = 1;
        let count = 0;
        let type = req.query.type;
        var a = {},
            b = {
                "type": type
            }
            //如果没有传type就查全部
            if(!type){
                b ={}  
            }
        if (req.query.state) {
            a = {
                "state": req.query.state
            }
        }
        News
            .find(Object.assign(a, b))
            .exec(function (err, docs) {
                if (err) return new Error(err);
                count = docs.length;
                pages = Math.ceil(count / pagesize);
                News
                    .find(Object.assign(a, b))
                    .sort({
                        "_id": -1
                    })
                    .skip((pagestart - 1) * pagesize)
                    .limit(pagesize)
                    .exec(function (err, docs) {
                        if (err) return next(new Error("操作失败"));
                        return rt.list(req, res, next, err, docs, pagestart, pages, count);
                    });
            })
    })
    .post('/notice', function (req, res, next) {
        let news = new News(req.body);
        news.save(function (err, doc) {
            if (err) return next(new Error("操作失败"));
            return rt.message(req, res, next, err, doc);
        })
    })
    .delete('/notice/manage/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        News
            .findByIdAndRemove(req.params.id, function (err, docs) {
                if (err) return next(err);
                return rt.message(req, res, next, err, docs);
            })
    });
router
    .get('/notice/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        News
            .findOne({
                "_id": req.params.id
            })
            .exec(function (err, doc) {
                if (err) return next(new Error("操作失败"));
                return rt.list(req, res, next, err, doc);
            })
    })
    .post('/notice/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        News
            .updateOne({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(new Error("操作失败"));
                return rt.update(req, res, next, err, row);
            })
    });
router
    .get('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Areas
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
        if (req.body.like) {
            Areas
                .findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $push: {
                        likeArr: {
                            openid: req.body.openid,
                            nickName: req.body.nickName,
                            time: new Date().getTime()
                        }
                    },
                    $inc: {
                        like: 1
                    }
                }, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                });
        } else if (req.body.unlike) {
            Areas
                .findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $push: {
                        likeArr: {
                            openid: req.body.openid,
                            nickName: req.body.nickName,
                            time: new Date().getTime()
                        }
                    },
                    $inc: {
                        unlike: 1
                    }
                }, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                });
        } else {
            Areas
                .findOneAndUpdate({
                    "_id": req.params.id
                }, req.body, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                })
        }


    });

module.exports = router;