let mongoose = require("mongoose");
let config = require("./config");

module.exports = function () {
    let db = mongoose.connect(config.mongodb, {
        useNewUrlParser: true
    });

    require("../models/users.server.model");
    require("../models/products.server.model");
    require("../models/product-users.server.model");
    require("../models/payments.server.model");
    require("../models/orders.server.model");
    require("../models/tels.server.model");
    require("../models/areas.server.model");
    require("../models/shops.server.model");
    require("../models/customs.server.model");
    require("../models/ranking.server.model");
    require("../models/admins.server.model");
    require("../models/coupon.server.model");
    require("../models/lose.server.model");
    require("../models/commit.server.model");
    require("../models/taobao-code.server.model");
    require("../models/managestatus.server.model");
    //...
    return db;
}