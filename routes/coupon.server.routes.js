var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Coupon = mongoose.model('Coupon');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    Coupon
        .find()
        .exec(function (err, docs) {
            return rt.list(req, res, next, err, docs);
        })
});
router.post('/', function (req, res, next) {
    Coupon
        .findOneAndUpdate({}, req.body, function (err, row) {
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
});
module.exports = router;