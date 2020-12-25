//订单信息
var mongoose = require('mongoose');
var OrdersSchema = new mongoose.Schema({
    pList: {
        type: Array,
        default: [],
        require: true
    },
    userInfo: {
        type: Object,
        default: {},
        require: true
    },
    openid: {
        type: String,
        default: '',
        require: true
    },
    total: {
        type: Number,
        default: 0
    },
    state: {
        type: Number,
        default: 0, //0:待付款、1:已付款、2:已取货、3:已退款
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

mongoose.model('Orders', OrdersSchema);