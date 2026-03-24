const coupons = require("../data/coupons");

function generateCouponCode(length = 24) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

function generateUniqueCouponCode() {
  let code = generateCouponCode();

  while (coupons.some((coupon) => coupon.code === code)) {
    code = generateCouponCode();
  }

  return code;
}

function getRemainingDays(expireAt) {
  const now = new Date();
  const expiry = new Date(expireAt);
  const diffMs = expiry - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

const getCoupons = (req, res) => {
  const result = coupons.map((coupon) => ({
    ...coupon,
    remainingDays: getRemainingDays(coupon.expireAt)
  }));

  return res.json({
    success: true,
    coupons: result
  });
};

const createCoupon = (req, res) => {
  const { name, discountPercent, expireInDays } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Tên coupon không được để trống."
    });
  }

  const discount = Number(discountPercent);
  const days = Number(expireInDays);

  if (Number.isNaN(discount) || discount < 0 || discount > 100) {
    return res.status(400).json({
      success: false,
      message: "Giảm giá phải từ 0 đến 100%."
    });
  }

  if (Number.isNaN(days) || days <= 0) {
    return res.status(400).json({
      success: false,
      message: "Số ngày hết hạn phải lớn hơn 0."
    });
  }

  const now = new Date();
  const expireAt = new Date(now);
  expireAt.setDate(expireAt.getDate() + days);

  const newCoupon = {
    id: Date.now(),
    code: generateUniqueCouponCode(),
    name: name.trim(),
    discountPercent: discount,
    minOrderValue: 50,
    expireAt: expireAt.toISOString(),
    createdAt: now.toISOString()
  };

  coupons.push(newCoupon);

  return res.status(201).json({
    success: true,
    message: "Tạo coupon thành công.",
    coupon: {
      ...newCoupon,
      remainingDays: getRemainingDays(newCoupon.expireAt)
    }
  });
};

const validateCoupon = (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập mã coupon."
    });
  }

  const coupon = coupons.find(
    (item) => item.code.toUpperCase() === code.trim().toUpperCase()
  );

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon không tồn tại."
    });
  }

  const remainingDays = getRemainingDays(coupon.expireAt);

  if (remainingDays <= 0) {
    return res.status(400).json({
      success: false,
      message: "Coupon đã hết hạn."
    });
  }

  const orderSubtotal = Number(subtotal);

  if (orderSubtotal < coupon.minOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Coupon chỉ áp dụng cho đơn từ ${coupon.minOrderValue.toLocaleString("vi-VN")} VNĐ.`
    });
  }

  const discountAmount = Math.floor(
    (orderSubtotal * coupon.discountPercent) / 100
  );

  return res.json({
    success: true,
    message: "Áp dụng coupon thành công.",
    coupon: {
      ...coupon,
      remainingDays
    },
    discountAmount
  });
};

module.exports = {
  getCoupons,
  createCoupon,
  validateCoupon
};