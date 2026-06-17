const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    role:{
        type:String,
        required:true
    },

    username:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    name:String,

    phone:String,

    address:String,

    storeName:String,

    taxId:String,

    licenseType:String,

    licenseNumber:String,

    businessProofImg:String,

    insuranceImg:String

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "User",
    userSchema
);
