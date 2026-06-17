const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");
const Food = require("./models/Food");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const Review = require("./models/Review");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
})
.catch(err=>{
    console.log(err);
});

/* =====================
   註冊
===================== */
app.post("/api/register", async(req,res)=>{

    try{

        const {
            username,
            password
        } = req.body;

        const exists =
        await User.findOne({
            username
        });

        if(exists){

            return res.status(400).json({
                success:false,
                message:"帳號已存在"
            });

        }

        const hash =
        await bcrypt.hash(
            password,
            10
        );

        const user =
        new User({
            ...req.body,
            password:hash
        });

        await user.save();

        res.json({
            success:true,
            message:"註冊成功"
        });

    }
    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

/* =====================
   登入
===================== */
app.post("/api/login", async(req,res)=>{

    try{

        const {
            username,
            password
        } = req.body;

        const user =
        await User.findOne({
            username
        });

        if(!user){

            return res.status(401).json({
                success:false,
                message:"帳號不存在"
            });

        }

        const match =
        await bcrypt.compare(
            password,
            user.password
        );

        if(!match){

            return res.status(401).json({
                success:false,
                message:"密碼錯誤"
            });

        }

        res.json({
            success:true,
            user
        });

    }
    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

/* =====================
   購物車
===================== */

// 建立或更新購物車

app.post("/api/cart", async(req,res)=>{

    try{

        const {

            userId,
            items,
            totalAmount

        } = req.body;

        let cart =
        await Cart.findOne({
            userId
        });

        if(cart){

            cart.items =
            items;

            cart.totalAmount =
            totalAmount;

            await cart.save();

        }
        else{

            cart =
            new Cart({

                userId,

                items,

                totalAmount

            });

            await cart.save();

        }

        res.json({

            success:true,

            data:cart

        });

    }
    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

});


// 取得購物車

app.get("/api/cart/:userId", async(req,res)=>{

    try{

        const cart =
        await Cart.findOne({

            userId:
            req.params.userId

        });

        res.json({

            success:true,

            data:cart

        });

    }
    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

});


// 清空購物車

app.delete("/api/cart/:userId", async(req,res)=>{

    try{

        await Cart.findOneAndDelete({

            userId:
            req.params.userId

        });

        res.json({

            success:true,

            message:"購物車已清空"

        });

    }
    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

});

/* =====================
   商品
===================== */

app.get("/api/foods", async(req,res)=>{

    const foods =
    await Food.find();

    res.json({
        success:true,
        data:foods
    });

});

app.post("/api/foods", async(req,res)=>{

    try{

        const food =
        new Food(req.body);

        await food.save();

        res.json({
            success:true,
            data:food
        });

    }
    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

/* =====================
   修改個人資料
===================== */

app.put("/api/profile", async(req,res)=>{

    try{

        const {
            userId,
            name,
            phone,
            address,
            email,
            avatar
        } = req.body;

        const user =
        await User.findByIdAndUpdate(

            userId,

            {
                name,
                phone,
                address,
                email,
                avatar
            },

            {
                new:true
            }

        );

        if(!user){

            return res.status(404).json({
                success:false,
                message:"找不到使用者"
            });

        }

        res.json({
            success:true,
            data:user,
            message:"個人資料更新成功"
        });

    }
    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

/* =====================
   店家商品管理
===================== */

// 修改商品

app.put("/api/foods/:id", async(req,res)=>{

    try{

        const food =
        await Food.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new:true
            }

        );

        if(!food){

            return res.status(404).json({

                success:false,

                message:"找不到商品"

            });

        }

        res.json({

            success:true,

            data:food,

            message:"商品更新成功"

        });

    }
    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

});


// 查看店家自己的商品

app.get("/api/foods/store/:storeId", async(req,res)=>{

    try{

        const foods =
        await Food.find({

            storeId:
            req.params.storeId

        });

        res.json({

            success:true,

            data:foods

        });

    }
    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

});

/* =====================
   訂單
===================== */

app.post("/api/orders", async(req,res)=>{

    try{

        const {
            items,
            paymentMethod
        } = req.body;

        for(const item of items){

            const food =
            await Food.findById(
                item.foodId
            );

            if(
                !food ||
                food.stock < item.qty
            ){

                return res.status(400).json({
                    success:false,
                    message:`${item.name} 庫存不足`
                });

            }

        }

        for(const item of items){

            await Food.findByIdAndUpdate(
                item.foodId,
                {
                    $inc:{
                        stock:-item.qty
                    }
                }
            );

        }

        let code = null;

        if(
            paymentMethod === "online"
        ){

            code =
            Math.floor(
                1000 +
                Math.random()*9000
            ).toString();

        }

        const order =
        new Order({

            ...req.body,

            deliveryCode:code

        });

        await order.save();

        res.json({
            success:true,
            data:order
        });

    }
    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

app.get("/api/orders", async(req,res)=>{

    const orders =
    await Order.find()
    .sort({
        createdAt:-1
    });

    res.json({
        success:true,
        data:orders
    });

});

/* =====================
   店家接單
===================== */

app.put(
"/api/orders/:id/accept",
async(req,res)=>{

    const order =
    await Order.findByIdAndUpdate(

        req.params.id,

        {
            status:"店家製作中"
        },

        {
            new:true
        }

    );

    res.json({
        success:true,
        data:order
    });

});

/* =====================
   騎手取餐
===================== */

app.put(
"/api/orders/:id/pickup",
async(req,res)=>{

    const order =
    await Order.findByIdAndUpdate(

        req.params.id,

        {
            status:"騎手配送中"
        },

        {
            new:true
        }

    );

    res.json({
        success:true,
        data:order
    });

});

/* =====================
   完成訂單
===================== */

app.put(
"/api/orders/:id/complete",
async(req,res)=>{

    const {
        inputCode
    } = req.body;

    const order =
    await Order.findById(
        req.params.id
    );

    if(!order){

        return res.status(404).json({
            success:false
        });

    }

    if(
        order.paymentMethod==="online"
    ){

        if(
            inputCode !==
            order.deliveryCode
        ){

            return res.status(400).json({
                success:false,
                message:"驗證碼錯誤"
            });

        }

    }

    order.status="已送達";

    await order.save();

    res.json({
        success:true,
        data:order
    });

});

/* =====================
   評論
===================== */

app.post(
"/api/orders/:id/review",
async(req,res)=>{

    const {
        stars
    } = req.body;

    const order =
    await Order.findById(
        req.params.id
    );

    for(const item of order.items){

        await Food.findByIdAndUpdate(
            item.foodId,
            {
                $inc:{
                    ratingSum:stars,
                    ratingCount:1
                }
            }
        );

    }

    order.status="已完成";

    await order.save();

    res.json({
        success:true,
        message:"感謝評價"
    });

});

const PORT =
process.env.PORT || 10000;

app.listen(PORT,()=>{

    console.log(
        `Server Running ${PORT}`
    );

});
