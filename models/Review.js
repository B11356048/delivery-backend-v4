const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    foodId:{
        type:String,
        required:true
    },

    userId:{
        type:String,
        required:true
    },

    userName:{
        type:String,
        default:""
    },

    stars:{
        type:Number,
        min:1,
        max:5,
        required:true
    },

    comment:{
        type:String,
        default:""
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "Review",
    reviewSchema
);
