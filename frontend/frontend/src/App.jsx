import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPage from "./pages/AdminPage";
import OrderManagementPage from "./pages/OrdersManagement";
import CustomersPage from "./pages/CustomersPage";
import CouponsPage from "./pages/CouponsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/orders" element={<OrderManagementPage />} />
      <Route path="/admin/customers" element={<CustomersPage />} />
      <Route path="/admin/coupons" element={<CouponsPage />} />
      
      
    </Routes>
  );
}