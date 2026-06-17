const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    memberEmail:String,

    memberName:String,

    address:String,

    items:[{
        foodId:String,
        name:String,
        price:Number,
        qty:Number
    }],

    totalAmount:Number,

    paymentMethod:{
        type:String,
        enum:[
            "cash",
            "online"
        ]
    },

    deliveryCode:String,

    status:{
        type:String,
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
