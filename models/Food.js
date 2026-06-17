const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({

    storeName:String,

    name:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    desc:String,

    stock:{
        type:Number,
        default:50
    },

    ratingSum:{
        type:Number,
        default:5
    },

    ratingCount:{
        type:Number,
        default:1
    },

    image:String

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "Food",
    foodSchema
);
