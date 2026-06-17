const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // 對應你 HTML 用 Date.now() 生成的流水號
    store: { type: String, required: true },            // 來源店家
    items: { type: String, required: true },            // 餐點內容明細字串
    price: { type: Number, required: true },            // 總金額
    status: { 
        type: String, 
        default: '待接單',
        enum: ['待接單', '準備中', '配送中', '已送達', '已取消'] // 對應你 HTML 的訂單狀態流程
    },
    address: { type: String, required: true },          // 外送地址
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
