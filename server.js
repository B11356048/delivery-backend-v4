const express = require('express');
const path = require('path');
const app = express();
// Render 會自動分配 PORT，若沒有則預設 3000
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 模擬資料庫假資料
let stores = [
    { id: 1, name: '好媽媽排骨飯', category: '便當快餐', status: '營業中' },
    { id: 2, name: '大呼過癮火鍋', category: '鍋物', status: '休息中' }
];

let drivers = [
    { id: 1, name: '張小明', phone: '0912-345678', status: '待審核' },
    { id: 2, name: '李大華', phone: '0923-456789', status: '已開通' }
];

let orders = [
    { id: 'ORD001', store: '好媽媽排骨飯', amount: 250, status: '外送中' },
    { id: 'ORD002', store: '大呼過癮火鍋', amount: 480, status: '已完成' }
];

// --- API 路由管理 ---

// 1. 店家 API
app.get('/api/stores', (req, res) => res.json(stores));
app.post('/api/stores', (req, res) => {
    const newStore = { id: stores.length + 1, ...req.body, status: '營業中' };
    stores.push(newStore);
    res.json({ success: true, data: stores });
});

// 2. 外送員 API
app.get('/api/drivers', (req, res) => res.json(drivers));
app.post('/api/drivers/verify', (req, res) => {
    const { id, status } = req.body;
    drivers = drivers.map(d => d.id === id ? { ...d, status } : d);
    res.json({ success: true, data: drivers });
});

// 3. 訂單 API
app.get('/api/orders', (req, res) => res.json(orders));

// 4. 營收統計 API
app.get('/api/revenue', (req, res) => {
    const total = orders.reduce((sum, o) => sum + o.amount, 0);
    res.json({ totalRevenue: total, orderCount: orders.length });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
