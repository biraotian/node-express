//产品信息
var mongoose = require('mongoose');
var ProductsSchema = new mongoose.Schema({
    //售卖类型
    sell_type: {
        type: Number,
        default: 1, //0:预售，1:现货
        required: true
    },
    // type
    //0 热卖
    //1 好吃的
    //2 好喝的
    //3 需冷藏
    //4 厨房用
    //5 清洁用
    //6 居家用
    //7 分不清
    type: {
        type: Number,
        default: 0, //冗余给以后分类用
    },
    title: {
        type: String,
        default: '',
        required: true
    },
    //是否推荐
    recommend: {
        type: Boolean,
        default: false
    },
    //规格
    spec: {
        type: String,
        default: '',
        required: true
    },
    //产品描述
    description: {
        type: String,
        default: '',
        required: true
    },
    //市场价
    oldPrice: {
        type: Number,
        default: 0.0,
        required: true
    },
    //现价
    price: {
        type: Number,
        default: 0.0,
        required: true
    },
    //已售数量
    solded: {
        type: Number,
        default: 0,
    },
    //剩余库存
    stock: {
        type: Number,
        default: null,
        required: true
    },
    //缩略图
    view_pic: {
        type: Object,
        default: []
    },
    //详情图
    view_pic_d: {
        type: Object,
        default: []
    },
    //是否上架中
    is_shelf: {
        type: Boolean,
        default: true
    },
    //产品来源，天猫/京东/直采/自营
    source: {
        type: String,
        default: "直采",
        required: true
    },
    company: {
        type: String,
        default: ""
    },
    //多少人喜欢？
    like: {
        type: Number,
        default: 0
    },
    //送达时间
    sendTime: {
        type: Number,
        default: new Date().getTime()
    },
    //结束时间
    endTime: {
        type: Number,
        default: new Date().getTime()
    },
    //参团人
    purchaser: {
        type: Array,
        default: []
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

mongoose.model('Products', ProductsSchema);