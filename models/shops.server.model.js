//门店基本信息
var mongoose = require("mongoose");

var ShopsSchema = new mongoose.Schema({
    //类型
    type: {
        type: String,
        default: '',
        require: true
    },
    //门店联系人手机号
    phone: {
        type: String,
        default: null,
        require: true
    },
    //门店小区名
    name: {
        type: String,
        default: '',
        require: true
    },
    //门店取货地址
    address: {
        type: String,
        default: '',
        require: true
    },
    //营业时间
    time: {
        type: String,
        default: '',
        require: true
    },
    pic: {
        type: Array,
        default: [],
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
    view: {
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    likeArr: {
        type: Array,
        default: []
    },
    likeStatus: {
        type: Boolean,
        default: false
    },
    report: {
        type: Number,
        default: 0
    },
    share: {
        type: Number,
        default: 0
    },
    shareArr: {
        type: Array,
        default: []
    },
    hot: {
        type: Boolean,
        default: false
    },
    //经营范围
    description: {
        type: String,
        default: '',
        require: true
    },
    state:{
        type: Number,
        default: 0
    },
    isHide:{
        type:Boolean,
        default:false
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
mongoose.model("Shops", ShopsSchema);