const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ==========================================
// 1. DATABASE MODELS (資料庫模型)
// ==========================================

// 使用者模型
const userSchema = new mongoose.Schema({
    role: { type: String, enum: ["customer", "merchant", "rider", "admin"], required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, default: "" },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    avatar: { type: String, default: "" },
    status: { type: String, default: "active" },
    storeName: { type: String, default: "" },
    taxId: { type: String, default: "" },
    businessProofImg: { type: String, default: "" },
    licenseType: { type: String, default: "" },
    licenseNumber: { type: String, default: "" },
    insuranceImg: { type: String, default: "" },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalIncome: { type: Number, default: 0 }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);

// 商品模型
const foodSchema = new mongoose.Schema({
    storeId: { type: String, default: "" },
    storeName: { type: String, default: "" },
    name: { type: String, required: true },
    category: { type: String, default: "其他" },
    desc: { type: String, default: "" },
    image: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 50 },
    isAvailable: { type: Boolean, default: true },
    salesCount: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 5 },
    ratingCount: { type: Number, default: 1 }
}, { timestamps: true });
const Food = mongoose.model("Food", foodSchema);

// 購物車模型 (修正補丁：加入 storeId 與 storeName)
const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        foodId: String,
        name: String,
        price: Number,
        qty: Number,
        image: String,
        storeId: String,
        storeName: String
    }],
    totalAmount: { type: Number, default: 0 }
}, { timestamps: true });
const Cart = mongoose.model("Cart", cartSchema);

// 訂單模型
const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, default: "" },
    memberId: { type: String, default: "" },
    memberEmail: { type: String, default: "" },
    memberName: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    merchantId: { type: String, default: "" },
    storeName: { type: String, default: "" },
    riderId: { type: String, default: "" },
    riderName: { type: String, default: "" },
    items: [{ foodId: String, name: String, price: Number, qty: Number }],
    remark: { type: String, default: "" },
    totalAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ["cash", "online"], default: "cash" },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    deliveryCode: { type: String, default: "" },
    reviewed: { type: Boolean, default: false },
    status: { type: String, enum: ["待店家接單", "店家製作中", "待騎手接單", "騎手配送中", "已送達", "已完成", "已取消"], default: "待店家接單" }
}, { timestamps: true });
const Order = mongoose.model("Order", orderSchema);

// 評論模型
const reviewSchema = new mongoose.Schema({
    foodId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, default: "" },
    stars: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" }
}, { timestamps: true });
const Review = mongoose.model("Review", reviewSchema);


// ==========================================
// 2. API ROUTES (介面路由)
// ==========================================

// 註冊與登入
app.post("/api/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json({ success: true, message: "註冊成功！" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: "帳號或密碼錯誤" });
    }
});

// 商品管理
app.post("/api/foods", async (req, res) => {
    const food = new Food(req.body);
    await food.save();
    res.json({ success: true, data: food });
});

app.get("/api/foods", async (req, res) => {
    const data = await Food.find({ isAvailable: true });
    res.json({ success: true, data });
});

app.get("/api/foods/store/:storeId", async (req, res) => {
    const data = await Food.find({ storeId: req.params.storeId });
    res.json({ success: true, data });
});

// 訂單管理
app.post("/api/orders", async (req, res) => {
    try {
        const orderData = req.body;
        orderData.orderNumber = "ORD" + Date.now();
        if (orderData.paymentMethod === "online") {
            orderData.deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();
            orderData.paymentStatus = "paid";
        }
        const order = new Order(orderData);
        await order.save();
        res.json({ success: true, data: order });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.get("/api/orders/user/:userId", async (req, res) => {
    const data = await Order.find({ memberId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data });
});

app.get("/api/orders/store/:merchantId", async (req, res) => {
    const data = await Order.find({ merchantId: req.params.merchantId }).sort({ createdAt: -1 });
    res.json({ success: true, data });
});

// 店家接單
app.put("/api/orders/:id/accept", async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: "店家製作中" });
    setTimeout(async () => {
        await Order.findByIdAndUpdate(req.params.id, { status: "待騎手接單" });
    }, 5000); // 模擬5秒後製作完成轉交大廳
    res.json({ success: true, message: "店家已接單，正在餐點製作中！" });
});

// 騎手大廳與配送
app.get("/api/orders/available", async (req, res) => {
    const data = await Order.find({ status: "待騎手接單" });
    res.json({ success: true, data });
});

app.put("/api/orders/:id/assign-rider", async (req, res) => {
    const { riderId, riderName } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { riderId, riderName, status: "騎手配送中" });
    res.json({ success: true, message: "搶單成功！請前往店家取餐配送。" });
});

app.get("/api/orders/rider/:riderId", async (req, res) => {
    const data = await Order.find({ riderId: req.params.riderId, status: "騎手配送中" });
    res.json({ success: true, data });
});

app.put("/api/orders/:id/complete", async (req, res) => {
    const { inputCode } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (order.paymentMethod === "online" && order.deliveryCode !== inputCode) {
        return res.json({ success: false, message: "外送驗證碼錯誤，無法結案！" });
    }
    
    order.status = "已送達";
    await order.save();
    res.json({ success: true, message: "訂單送達完成！" });
});

// 評價系統
app.post("/api/orders/:id/review", async (req, res) => {
    const { userId, userName, stars, comment } = req.body;
    const order = await Order.findById(req.params.id);
    
    for (let item of order.items) {
        const rev = new Review({ foodId: item.foodId, userId, userName, stars, comment });
        await rev.save();
        await Food.findByIdAndUpdate(item.foodId, { $inc: { ratingSum: stars, ratingCount: 1 } });
    }
    
    order.reviewed = true;
    await order.save();
    res.json({ success: true, message: "感謝您的評價！" });
});

// 連接 MongoDB 並啟動
mongoose.connect("你的MongoDB連線字串_如果趕時間也可以用本地mongodb://localhost:27017/delivery")
    .then(() => app.listen(process.env.PORT || 3000, () => console.log("伺服器運行中...")))
    .catch(err => console.log(err));
