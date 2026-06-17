const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    role:{
        type:String,
        enum:[
            "customer",
            "merchant",
            "rider",
            "admin"
        ],
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

    email:{
        type:String,
        default:""
    },

    name:{
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

    avatar:{
        type:String,
        default:""
    },

    status:{
        type:String,
        default:"active"
    },

    // ===== 店家專用 =====

    storeName:{
        type:String,
        default:""
    },

    taxId:{
        type:String,
        default:""
    },

    businessProofImg:{
        type:String,
        default:""
    },

    // ===== 騎手專用 =====

    licenseType:{
        type:String,
        default:""
    },

    licenseNumber:{
        type:String,
        default:""
    },

    insuranceImg:{
        type:String,
        default:""
    },

    // ===== 統計 =====

    totalOrders:{
        type:Number,
        default:0
    },

    totalSpent:{
        type:Number,
        default:0
    },

    totalIncome:{
        type:Number,
        default:0
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "User",
    userSchema
);
