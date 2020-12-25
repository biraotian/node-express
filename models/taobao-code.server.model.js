//淘宝优惠码，值得买
var mongoose = require('mongoose');
var taobaoCodesSchema = new mongoose.Schema({
    imgList: {
        type: Array,
        default: []
    },
    code: {
        type: String,
        default: null,
        required: true
    },
    //多少人喜欢？
    like: {
        type: Number,
        default: 0
    },
    //多少人看？
    view: {
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

mongoose.model('TaobaoCodes', taobaoCodesSchema);