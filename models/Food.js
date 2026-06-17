const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({

    // 店家資訊
    storeId:{
        type:String,
        default:""
    },

    storeName:{
        type:String,
        default:""
    },

    // 商品資訊
    name:{
        type:String,
        required:true
    },

    category:{
        type:String,
        default:"其他"
    },

    desc:{
        type:String,
        default:""
    },

    image:{
        type:String,
        default:""
    },

    // 價格與庫存
    price:{
        type:Number,
        required:true
    },

    stock:{
        type:Number,
        default:50
    },

    // 是否上架
    isAvailable:{
        type:Boolean,
        default:true
    },

    // 銷售統計
    salesCount:{
        type:Number,
        default:0
    },

    // 評價統計
    ratingSum:{
        type:Number,
        default:5
    },

    ratingCount:{
        type:Number,
        default:1
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "Food",
    foodSchema
);
