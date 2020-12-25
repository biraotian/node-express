//添加评论
var mongoose = require("mongoose");
var CommitsSchema = new mongoose.Schema(
  {
    artid: {
      type: String,
      default: "",
      require: true,
    },
    nickName: {
      type: String,
      default: "",
      require: true,
    },
    openid: {
      type: String,
      default: "",
      require: true,
    },
    targetnickName: {
      type: String,
      default: "",
      require: true,
    },
    targetopenid: {
      type: String,
      default: "",
      require: true,
    },
    content: {
      type: String,
      default: "",
      require: true,
    },
    state: {
      type: Number,
      default: 0,
    },
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } }
);

mongoose.model("Commits", CommitsSchema);
