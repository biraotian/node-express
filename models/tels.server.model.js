//电话号码管理
var mongoose = require("mongoose");

var TelsSchema = new mongoose.Schema({
    type: {
        type: Number,
        default: 0,
        required: true  
    },
    name: {
        type: String,
        default: '',
        require: true
    },
    phone: {
        type: String,
        default: null,
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

mongoose.model("Tels", TelsSchema);