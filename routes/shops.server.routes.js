var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Shops = mongoose.model('Shops');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;
    var pages = 1;
    var orderby = "";
    var a = {},
        c = {},
        d = {},
        e = {},
        f = {
            "isHide":false
        };
    if (req.query.openid) {
        a = {
            "openid": req.query.openid
        }
    }
    if (req.query.sort == 1) {
        orderby = {
            "_id": -1
        }
    }else{
        orderby = {
            "like": -1
        }
    }
    if (req.query.type && req.query.type!="默认所有") {
        c = {
            "type": req.query.type
        }
    }
    if (req.query.state) {
        d = {
            "state": req.query.state
        }
    }
    if (req.query.hot) {
        e = {
            "hot": req.query.hot
        }
    }
    Shops
        .find(Object.assign(a, c, d, e, f))
        .exec(function (err, docs) {
            if (err) return new Error(err);
            pages = Math.ceil(docs.length / pagesize);
            Shops
                .find(Object.assign(a, c, d, e, f))
                .sort(orderby)
                .skip((pagestart - 1) * pagesize)
                .limit(pagesize)
                .exec(function (err, docs) {
                    if (err) return next(new Error("操作失败"));
                    return rt.list(req, res, next, err, docs, pagestart, pages);
                });
        })
});
router.get('/search', function (req, res, next) {
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;
    var pages = 1;
    var g = {};
    if(req.query.keys){
        g = {
            "name":{$regex:req.query.keys}
        }
    }
    Shops
        .find(g)
        .exec(function (err, docs) {
            if (err) return new Error(err);
            pages = Math.ceil(docs.length / pagesize);
            Shops
                .find(g)
                .skip((pagestart - 1) * pagesize)
                .limit(pagesize)
                .exec(function (err, docs) {
                    if (err) return next(new Error("操作失败"));
                    return rt.list(req, res, next, err, docs, pagestart, pages);
                });
        })
});
router.post('/create', function (req, res, next) {
    var shops = new Shops(req.body);
    shops.save(function (err, doc) {
        if (err) return next(new Error("操作失败"));
        return rt.message(req, res, next, err, doc);
    })
});
router
    .get('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Shops
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
        if (req.body.addView) {
            Shops
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
        } else if (req.body.addlike == true) {
            Shops
                .findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $push: {
                        likeArr: {
                            openid: req.body.openid,
                            nickName: req.body.nickName,
                            time:new Date().getTime()
                        }
                    },
                    $inc: {
                        like: 1
                    }
                }, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                });
        } else if (req.body.addshare == true) {
            Shops
                .findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $push: {
                        shareArr: {
                            openid: req.body.openid,
                            nickName: req.body.nickName,
                            time:new Date().getTime()
                        }
                    },
                    $inc: {
                        share: 1
                    }
                }, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                });
        } else {
            Shops
                .findOneAndUpdate({
                    "_id": req.params.id
                }, req.body, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                })
        }
    })
    .delete('/detail/:id',function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Shops
            .findOneAndUpdate({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(err);
                return rt.update(req, res, next, err, row);
            });
    })
    .delete('/manage/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Shops
            .findByIdAndRemove(req.params.id, function (err, docs) {
                if (err) return next(err);
                return rt.message(req, res, next, err, docs);
            })
    });
module.exports = router;