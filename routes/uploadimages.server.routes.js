var express = require('express');
var router = express.Router();
var path = require("path");
//生成文件夹名称20190519
var rt = require('./rt.interceptor');
var userDirPath = './uploads/'+ rt.getNowFormatDate();//存放图片的文件名称
router.post('/',function(req, res, next){
    var fs = require('fs');
    var formidable = require('formidable');
    // var userDirPath = cacheFolder;
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.multiples = true;//设置为多文件上传
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;

    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        var filesUrl = [];//文件路径
        var errCount = 0; //上传失败数量
        var keys = files['files'];
        if(!keys.length){
            keys = new Array(keys);
        };
        keys.forEach(function(key){
            var fileName = "";
            var targetFile = "";
            var filePath = key.path;
            var fileExt = filePath.substring(filePath.lastIndexOf('.'));
            if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
                errCount += 1;
            } else {
                //以当前时间戳对上传文件进行重命名
                fileName = new Date().getTime() + '-' + Math.random() + fileExt;
                targetFile = path.join(userDirPath, fileName);
                // 文件的Url（相对路径）
                filesUrl.push('/' + targetFile.replace(/\\/g, "/"));
                //移动文件
                fs.renameSync(filePath, targetFile);
            }
        });
        // 返回上传信息
        res.json({
            filesUrl:filesUrl,
            success:keys.length-errCount,
            error:errCount
        });
        return;
    });
});

module.exports = router;