//管理员信息
var mongoose = require('mongoose');
var AdminSchema = new mongoose.Schema({
    usr: {
        type: String,
        default: null,
        required: true
    },
    psw: {
        type: String,
        default: null,
        required: true
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

mongoose.model('Admins', AdminSchema);