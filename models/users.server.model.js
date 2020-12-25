//用户信息
var mongoose = require('mongoose');
var UsersSchema = new mongoose.Schema({
    userInfo: {
        type: Object,
        default: ''
    },
    openid: {
        type: String,
        default: '',
        required: true
    },
    phone: {
        type: Number,
        default: null
    },
    wx_id: {
        type: String,
        default: ''
    },
    //最后登陆的门店id
    lastArea: {
        type: String,
        default: ''
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

mongoose.model('Users', UsersSchema);