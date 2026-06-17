const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    storeName: { type: String, required: true }, // 店家名稱
    foodName: { type: String, required: true },  // 餐點名稱
    price: { type: Number, required: true },     // 價格
    desc: { type: String, default: '' },         // 餐點描述
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', FoodSchema);
