//团长状态
var mongoose = require('mongoose');
var ManageStatusSchema = new mongoose.Schema({
    status: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ""
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
});

mongoose.model('ManageStatus', ManageStatusSchema);