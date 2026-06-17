const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// 引入剛剛寫好的三個 Models
const User = require('./models/User');
const Food = require('./models/Food');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "你的_MONGODB_雲端連接字串";

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

// 2. 商家新增上架餐點
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
    const allFoods = await Food.find();
    res.json(allFoods);
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
    const allOrders = await Order.find();
    res.json(allOrders);
});

// 4. 更新訂單狀態
app.post('/api/orders/update-status', async (req, res) => {
    try {
        const { id, status } = req.body;
        await Order.updateOne({ id: Number(id) }, { status });
        const allOrders = await Order.find();
        res.json({ success: true, data: allOrders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`[速食達人] 伺服器成功架設在 Port: ${PORT}`);
});
