const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    // 訂單編號
    orderNumber:{
        type:String,
        default:""
    },

    // 會員資訊
    memberId:{
        type:String,
        default:""
    },

    memberEmail:{
        type:String,
        default:""
    },

    memberName:{
        type:String,
        default:""
    },

    phone:{
        type:String,
        default:""
    },

    address:{
        type:String,
        default:""
    },

    // 店家資訊
    merchantId:{
        type:String,
        default:""
    },

    storeName:{
        type:String,
        default:""
    },

    // 騎手資訊
    riderId:{
        type:String,
        default:""
    },

    riderName:{
        type:String,
        default:""
    },

    // 商品內容
    items:[{

        foodId:String,

        name:String,

        price:Number,

        qty:Number

    }],

    // 備註
    remark:{
        type:String,
        default:""
    },

    // 金額
    totalAmount:{
        type:Number,
        default:0
    },

    // 付款方式
    paymentMethod:{
        type:String,
        enum:[
            "cash",
            "online"
        ],
        default:"cash"
    },

    // 付款狀態
    paymentStatus:{
        type:String,
        enum:[
            "unpaid",
            "paid"
        ],
        default:"unpaid"
    },

    // 驗證碼
    deliveryCode:{
        type:String,
        default:""
    },

    // 是否評論
    reviewed:{
        type:Boolean,
        default:false
    },

    // 訂單狀態
    status:{
        type:String,
        enum:[

            "待店家接單",

            "店家製作中",

            "待騎手接單",

            "騎手配送中",

            "已送達",

            "已完成",

            "已取消"

        ],
        default:"待店家接單"
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "Order",
    orderSchema
);
