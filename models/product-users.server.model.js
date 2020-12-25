//管理产品的购买记录
var mongoose = require('mongoose');
var ProductUsersSchema = new mongoose.Schema({
    //
    pid: {
        type: String,
        default: "", //产品id
        required: true
    },
    count: {
        type: Number,
        default: 1, //购买数量
    },
    userInfo: {
        type: Object,
        default: {},
        required: true
    },
    //时间
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
},{timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}});

mongoose.model('ProductUsers', ProductUsersSchema);