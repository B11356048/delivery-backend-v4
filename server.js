const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // 引入資料庫套件
const app = express();

const PORT = process.env.PORT || 3000;

// 填入你的 MongoDB 連接字串，如果是在 Render 部署，建議設定在環境變數中
const MONGODB_URI = process.env.MONGODB_URI || "你的_MONGODB_雲端連接字串";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === 1. 連接 MongoDB 資料庫 ===
mongoose.connect(MONGODB_URI)
    .then(() => console.log('🎉 成功連接到 MongoDB 雲端資料庫！'))
    .catch(err => console.error('❌ 資料庫連接失敗:', err));

// === 2. 定義資料模型 (Schemas) —— 完美對應你 HTML 的資料欄位 ===
const FoodSchema = new mongoose.Schema({
    storeName: String,
    foodName: String,
    price: Number,
    desc: String
});
const Food = mongoose.model('Food', FoodSchema);

const OrderSchema = new mongoose.Schema({
    id: Number,
    store: String,
    items: String,
    price: Number,
    status: { type: String, default: '待接單' },
    address: String
});
const Order = mongoose.model('Order', OrderSchema);


// === 3. API 路由管理（資料改從資料庫讀寫） ===

// 註冊驗證（保持簡單驗證）
app.post('/api/register', (req, res) => {
    res.json({ success: true, message: '註冊驗證通過！' });
});

// 商家上架餐點：存入資料庫
app.post('/api/foods', async (req, res) => {
    try {
        const newFood = new Food(req.body);
        await newFood.save();
        const allFoods = await Food.find(); // 重新抓取所有餐點回傳
        res.json({ success: true, data: allFoods });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 獲取所有餐點
app.get('/api/foods', async (req, res) => {
    const allFoods = await Food.find();
    res.json(allFoods);
});

// 消費者送出訂單：存入資料庫
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

// 獲取所有訂單
app.get('/api/orders', async (req, res) => {
    const allOrders = await Order.find();
    res.json(allOrders);
});

// 更新訂單狀態（接單、派送等）
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
    console.log(`伺服器成功架設在 Port: ${PORT}`);
});
