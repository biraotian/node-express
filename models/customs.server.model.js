//企业订制
var mongoose = require("mongoose");

var CustomsSchema = new mongoose.Schema({
    //电话
    phone: {
        type: String,
        default: null,
        require: true
    },
    //姓名
    name: {
        type: String,
        default: '',
        require: true
    },
    openid: {
        type: String,
        default: '',
        require: true
    },
    userInfo: {
        type: Object,
        default: '',
        require: true
    },
    //需求描述
    description: {
        type: String,
        default: '',
        require: true
    },
    //状态
    state: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
},{timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}});

mongoose.model("Customs", CustomsSchema);