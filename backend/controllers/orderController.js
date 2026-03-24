const orders = require("../data/orders");

const createOrder = (req, res) => {
  const {
    userId,
    customerName,
    items,
    subtotal,
    taxes,
    delivery,
    total,
    couponCode,
    discountAmount
  } = req.body;

  if (!userId || !customerName) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin người dùng."
    });
  }

  if (!items || !items.length) {
    return res.status(400).json({
      success: false,
      message: "Giỏ hàng đang trống."
    });
  }

  const newOrder = {
    id: "OD" + Date.now(),
    userId,
    customerName,
    items,
    subtotal: Number(subtotal) || 0,
    taxes: Number(taxes) || 0,
    delivery: Number(delivery) || 0,
    discountAmount: Number(discountAmount) || 0,
    couponCode: couponCode || null,
    total: Number(total) || 0,
    status: "Paid",
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  return res.status(201).json({
    success: true,
    message: "Thanh toán thành công!",
    order: newOrder
  });
};

const getOrders = (req, res) => {
  return res.json({
    success: true,
    orders
  });
};

module.exports = {
  createOrder,
  getOrders
};