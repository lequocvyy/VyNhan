import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/storage";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img src={product.images[0]} alt={product.name} />
      <div className="rating">{"★".repeat(Math.round(product.rating))}</div>
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
    </Link>
  );
}