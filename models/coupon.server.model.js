//满减优惠券
var mongoose = require('mongoose');
var CouponSchema = new mongoose.Schema({
    newUserSales: {
        type: Boolean,
        default: false
    },
    newUserSales_v: {
        type: Number,
        default: 0.95
    },
    fullCutSales: {
        type: Boolean,
        default: false
    },
    fullCutSales_v: {
        type: Object,
        default: {
            full: 100,
            cut: 10
        }
    },
    discountSales: {
        type: Boolean,
        default: false
    },
    discountSales_v: {
        type: Number,
        default: 0.95
    }
});

mongoose.model('Coupon', CouponSchema);