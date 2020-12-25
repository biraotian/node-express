//团长基本信息
var mongoose = require("mongoose");

var AreasSchema = new mongoose.Schema({
    wx_id: {
        type: String,
        default: ''
    },
    wx_name: {
        type: String,
        default: ''
    },
    wx_head: {
        type: String,
        default: ''
    },
    phone: {
        type: Number,
        default: null
    },
    latitude: {
        type: Number,
        default: 31.82057
    },
    longitude: {
        type: Number,
        default: 117.22901
    },
    area: {
        type: String,
        default: ''
    },
    areaLogo: {
        type: String,
        default: ''
    },
    areaName: {
        type: String,
        default: ''
    },
    areaTel: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    like:{
        type: Number,
        default: 0
    },
    unlike:{
        type: Number,
        default: 0
    },
    likeArr:{
        type:Array,
        default:[]
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

var NewsSchema = new mongoose.Schema({
    type:{
        type:Number,
        default:0,
        required:true
    },
    title: {
        type: String,
        default: '',
        maxlength:40
    },
    description: {
        type: String,
        default: '',
        maxlength:65535,
        required:true
    },
    openid:{
        type:String,
        default:"",
    },
    userInfo:{
        type:Object,
        default:{}
    },
    pic: {
        type:Array,
        default: []
    },
    feedback: {
        type:Array,
        default: []
    },
    state: {
        type:Number,
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

mongoose.model("Areas", AreasSchema);
mongoose.model("News", NewsSchema);