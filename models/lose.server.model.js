//添加信息
var mongoose = require('mongoose');
var LoseSchema = new mongoose.Schema({
    typeName: {
        type: String,
        default: "",
        require: true
    },
    type: {
        type: Number,
        default: '',
        require: true
    },
    description: {
        type: String,
        default: "",
        require: true
    },
    filesUrl: {
        type: Array,
        default: [],
        require: true
    },
    openid: {
        type: String,
        default: '',
        require: true
    },
    phone:{
        type:Number,
        default:'',
        required:true
    },
    userInfo: {
        type: Object,
        default: '',
        require: true
    },
    state: {
        type: Number,
        default: 0, //0:待审核、1:已审核
    },
    //多少人喜欢？
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
    //多少人分享？
    share: {
        type: Number,
        default: 0
    },
    //多少人看？
    view: {
        type: Number,
        default: 0
    },
    //多少人评论
    commit: {
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

mongoose.model('Lose', LoseSchema);