const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// 引入寫好的三個 Models
const User = require('./models/User');
const Food = require('./models/Food');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3000;

// 已填入你提供的 MongoDB 連線字串，並加上預設資料庫名稱 fastfood
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://123:www@cluster0.fr8fewc.mongodb.net/fastfood?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 連接資料庫
mongoose.connect(MONGODB_URI)
    .then(() => console.log('🎉 成功連接到 MongoDB 雲端資料庫！'))
    .catch(err => console.error('❌ 資料庫連接失敗:', err));

// === API 路由管理 ===

// 1. 多元身分註冊
app.post('/api/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ success: true, message: '註冊驗證成功並已寫入資料庫！', user: newUser });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. 商家上架餐點
app.post('/api/foods', async (req, res) => {
    try {
        const newFood = new Food(req.body);
        await newFood.save();
        const allFoods = await Food.find();
        res.json({ success: true, data: allFoods });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 獲取餐點列表
app.get('/api/foods', async (req, res) => {
    try {
        const allFoods = await Food.find();
        res.json(allFoods);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. 消費者送出訂單
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order({
            id: req.body.id || Date.now(),
            ...req.body
        });
        await newOrder.save();
        const allOrders = await Order.find();
        res.json({ success: true, data: allOrders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 獲取訂單列表
app.get('/api/orders', async (req, res) => {
    try {
        const allOrders = await Order.find();
        res.json(allOrders);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. 更新訂單狀態（商家接單、騎手配送等）
app.post('/api/orders/updateStatus', async (req, res) => {
    try {
        const { id, status } = req.body;
        await Order.findOneAndUpdate({ id: Number(id) }, { status: status });
        const allOrders = await Order.find();
        res.json({ success: true, data: allOrders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
