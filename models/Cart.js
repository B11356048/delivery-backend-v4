const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },

    items:[{

        foodId:String,

        name:String,

        price:Number,

        qty:Number,

        image:String

    }],

    totalAmount:{
        type:Number,
        default:0
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "Cart",
    cartSchema
);
