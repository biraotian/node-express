var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Products = mongoose.model('Products');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    var key = req.query.key || "";
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;
    var pages = 1;
    var params = {
        "sell_type": req.query.sell_type
    };
    if (req.query.type) {
        params["type"] = req.query.type;
    } else if (req.query.recommend) {
        params["recommend"] = req.query.recommend;
    }
    if (!key) {
        Products
            .find()
            .exec(function (err, docs) {
                if (err) return next(err);
                pages = Math.ceil(docs.length / pagesize);
                Products
                    .find(params)
                    .skip((pagestart - 1) * pagesize)
                    .limit(pagesize)
                    .exec(function (err, docs) {
                        if (err) return next(new Error("操作失败"));
                        return rt.list(req, res, next, err, docs, pagestart, pages);
                    })
            });
    } else {
        Products
            .find({
                $or: [{
                    title: {
                        $regex: key
                    }
                }]
            })
            .exec(function (err, docs) {
                if (err) return next(err);
                return rt.list(req, res, next, err, docs);
            })
    }
});
router.post('/create', function (req, res, next) {
    var products = new Products(req.body);
    products.save(function (err) {
        if (err) return next(new Error("操作失败"));
        return rt.message(req, res, next, err, products);
    })
});
router.post('/edit/:id', function (req, res, next) {
    Products
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
        Products
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
        if (req.body.addlike) {
            Products
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
        }
    });

module.exports = router;