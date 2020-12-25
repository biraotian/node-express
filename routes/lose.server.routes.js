var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Lose = mongoose.model('Lose');
var Commits = mongoose.model('Commits');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;
    var pages = 1;
    var orderby = {
        "_id": -1
    };
    var a = {},
        b = {},
        c = {},
        g = {};
    if (req.query.typeName) {
        a = {
            "typeName": req.query.typeName
        }
    }
    if (req.query.openid) {
        b = {
            "openid": req.query.openid
        }
    }
    if (req.query.state) {
        c = {
            "state": req.query.state
        }
    }
    if (req.query.sort == 1) {
        orderby = {
            "_id": -1
        }
    }
    if (req.query.keys) {
        g = {
            "description": {
                $regex: req.query.keys
            }
        }
    }
    Lose
        .find(Object.assign(a, b, c, g))
        .exec(function (err, docs) {
            if (err) return new Error(err);
            pages = Math.ceil(docs.length / pagesize);
            Lose
                .find(Object.assign(a, b, c, g))
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
    let lose = new Lose(req.body);
    Lose
        .find({
            "description": req.body.description
        })
        .exec(function (err, docs) {
            if (err) return new Error(err);
            if (docs != "") {
                return res.json({
                    "status": 201,
                    "data": "已存在相同的信息"
                });
            } else {
                lose.save(function (err) {
                    if (err) return next(new Error("操作失败"));
                    return rt.message(req, res, next, err, lose);
                })
            }
        })
});
router
    .get('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Lose
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
            Lose
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
            Lose
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
        } else if (req.body.addlike == false) {
            Lose
                .findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $pull: {
                        likeArr: {
                            openid: req.body.openid
                        }
                    },
                    $inc: {
                        like: -1
                    }
                }, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.update(req, res, next, err, row);
                });
        } else {
            Lose
                .findOneAndUpdate({
                    "_id": req.params.id
                }, req.body, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    if (row) {
                        return res.json({
                            "status": 200,
                            "data": "成功"
                        });
                    } else {
                        return res.json({
                            "status": 201,
                            "data": "失败"
                        });
                    }
                });
        }

    })
    .delete('/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Lose
            .findOneAndUpdate({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(err);
                return rt.update(req, res, next, err, row);
            });
    })
    .delete('/manage/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Lose
            .findByIdAndRemove(req.params.id, function (err, docs) {
                if (err) return next(err);
                return rt.message(req, res, next, err, docs);
            })
    });
router
    .get('/commit', function (req, res, next) {
        if (req.query.id) {
            var a = {
                    "artid": req.query.id,
                },
                b = {};
            if (req.query.state) {
                b = {
                    "state": req.query.state
                }
            }
            Commits
                .find(Object.assign(a, b))
                .exec(function (err, doc) {
                    if (err) return next(new Error("操作失败"));
                    return rt.list(req, res, next, err, doc);
                });
        } else {
            var pagesize = parseInt(req.query.pagesize, 10) || 10;
            var pagestart = parseInt(req.query.pagestart, 10) || 1;
            var pages = 1;
            var orderby = "";
            var a = {},
                b = {};
            if (req.query.openid) {
                a = {
                    "openid": req.query.openid
                }
            }
            if (req.query.sort == 1) {
                orderby = {
                    "_id": -1
                }
            }
            if (req.query.state) {
                b = {
                    "state": req.query.state
                }
            }
            Commits
                .find(Object.assign(a, b))
                .exec(function (err, docs) {
                    if (err) return new Error(err);
                    pages = Math.ceil(docs.length / pagesize);
                    Commits
                        .find(Object.assign(a, b))
                        .sort(orderby)
                        .skip((pagestart - 1) * pagesize)
                        .limit(pagesize)
                        .exec(function (err, docs) {
                            if (err) return next(new Error("操作失败"));
                            return rt.list(req, res, next, err, docs, pagestart, pages);
                        });
                })
        }

    })
    .post('/commit', function (req, res, next) {
        let commits = new Commits(req.body);
        commits.save(function (err, doc) {
            if (err) return next(err);
            Lose
                .findOneAndUpdate({
                    "_id": req.body.artid
                }, {
                    $inc: {
                        commit: 1
                    }
                }, function (err, row) {
                    if (err) return next(new Error("操作失败"));
                    return rt.message(req, res, next, err, doc);
                });
        })
    })
    .post('/commit/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Commits
            .findOneAndUpdate({
                "_id": req.params.id
            }, req.body, function (err, row) {
                if (err) return next(new Error("操作失败"));
                if (row) {
                    return res.json({
                        "status": 200,
                        "data": "成功"
                    });
                } else {
                    return res.json({
                        "status": 201,
                        "data": "失败"
                    });
                }
            });
    })
    .delete('/commit/detail/:id', function (req, res, next) {
        if (!req.params.id) return next(new Error("没有传id"));
        Commits
            .findByIdAndRemove(req.params.id, function (err, docs) {
                if (err) return next(err);
                return rt.message(req, res, next, err, docs);
            })
    });
module.exports = router;