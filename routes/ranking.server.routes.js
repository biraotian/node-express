var request = require('request');
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Ranking = mongoose.model('Ranking');

var rt = require('./rt.interceptor');

router.get('/', function (req, res, next) {
    Ranking
        .find()
        .sort({
            "_id": -1
        })
        .limit(1)
        .exec(function (err, docs) {
            return rt.list(req, res, next, err, docs);
        })
});

router.get('/create', function (req, res, next) {
    var uri = `http://localhost:3000/order?ranking=true`;
    request.get(uri, function (error, data) {
        // 已wx_id为单位获取个人消费情况
        data = JSON.parse(data.body).data;
        let c = [];
        let d = {};
        data.forEach(element => {
            if (!d[element.wx_id]) {
                c.push({
                    wx_id: element.wx_id,
                    wx_name: element.wx_name,
                    wx_head: element.wx_head,
                    // allData: [element],
                    total: element.total
                });
                d[element.wx_id] = element;
            } else {
                c.forEach(ele => {
                    if (ele.wx_id == element.wx_id) {
                        // ele.allData.push(element);
                        ele.allData.total = ((ele.allData.total * 10 + element.total * 10) / 10).toFixed(1);
                    }
                });
            }
        });
        //对c进行排序，只取前10
        var arr = c;
        var max;
        for (var i = 0; i < arr.length; i++) {
            for (var j = i; j < arr.length; j++) {
                if (arr[i].total < arr[j].total) {
                    max = arr[j]
                    arr[j] = arr[i]
                    arr[i] = max;
                }
            }
        }
        c = arr.slice(0, 9);
        //对结果进行保存
        var ranking = new Ranking({
            ranking: c
        });
        ranking.save(function (err, doc) {
            if (err) return next(new Error("操作失败"));
            return rt.message(req, res, next, err, doc);
        });
    }).on('error', function (e) {
        console.log("更新排行榜失败");
    });
});

module.exports = router;