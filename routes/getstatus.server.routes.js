var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
var ManageStatus = mongoose.model('ManageStatus');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    ManageStatus
        .find()
        .exec(function (err, docs) {
            if (err) return next(new Error("操作失败"));
            return rt.list(req, res, next, err, docs);
        });
});
router.post('/create', function (req, res, next) {
    var managestatus = new ManageStatus(req.body);
    managestatus.save(function (err) {
        if (err) return next(new Error("操作失败"));
        return rt.message(req, res, next, err, managestatus);
    })
});
router.post('/update/:id', function (req, res, next) {
    if (!req.params.id) return next(new Error("没有传id"));
    ManageStatus
        .findOneAndUpdate({
            "_id": req.params.id
        }, req.body, function (err, row) {
            if (err) return next(new Error("操作失败"));
            return rt.update(req, res, next, err, row);
        });
});
module.exports = router;