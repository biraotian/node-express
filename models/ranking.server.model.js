//门店基本信息
var mongoose = require("mongoose");
var RankingSchema = new mongoose.Schema({
    ranking: {
        type: Array,
        default: []
    },
    createTime: {
        type: Number,
        default: new Date().getTime()
    },
});

mongoose.model('Ranking', RankingSchema);