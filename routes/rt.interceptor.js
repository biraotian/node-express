module.exports = {
  list: function (req, res, next, err, doc, pagestart, pages,count) {
    if (err) return next(err);
    var pagestart = pagestart || 1;
    var count = count || 0;
    var pages = pages || 1;
    if (doc) {
      res.status(200);
      res.json({
        "status": 200,
        "data": {
          "list": doc,
          "count":count,
          "pagestart": pagestart,
          "pages": pages
        },
      });
    } else {
      next(new Error("报错了"))
    }
  },
  message: function (req, res, next, err, doc) {
    if (err) return next(err);
    if (doc) {
      res.status(200);
      res.json({
        "status": 200,
        "data": "成功",
        "doc": doc
      });
    } else {
      res.status(201);
      res.json({
        "status": 201,
        "data": "失败"
      });
    }
  },
  update: function (req, res, next, err, row) {
    if (err) return next(err);
    if (row) {
      res.status(200);
      res.json({
        "status": 200,
        "data": "成功",
        "row":row
      });
    } else {
      res.status(201);
      res.json({
        "status": 201,
        "data": "失败"
      });
    }
  },
  getNowFormatDate: function (type) {
    //支持2019-02-12 & 20190212
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (type == 'string') {
      return year + '-' + month + '-' + strDate + ' 00:00:00';
    } else {
      return year.toString() + month.toString() + strDate.toString();
    }
  }
};