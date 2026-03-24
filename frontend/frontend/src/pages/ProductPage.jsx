import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import ProductCard from "../components/ProductCard";
import {
  getCart,
  getCurrentUser,
  saveCart,
  saveBuyNowItem
} from "../utils/storage";
import { fetchProductById, fetchProducts } from "../services/productService";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const currentUser = getCurrentUser();

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      const productResult = await fetchProductById(id);
      const allProductsResult = await fetchProducts();

      if (productResult.success) {
        const loadedProduct = productResult.product;
        setProduct(loadedProduct);
        setSelectedImage(loadedProduct?.images?.[0] || "");
        setSelectedSize(loadedProduct?.sizes?.[0] || "");
      } else {
        setProduct(null);
      }

      setAllProducts(allProductsResult.products || []);
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="container">Loading product...</div>;
  }

  if (!product) {
    return <div className="container">Product not found.</div>;
  }

  const similarProducts = allProducts.filter(
    (p) => p.id !== product.id && p.category === product.category
  );

  const handleAddToCart = () => {
    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        item.image === selectedImage &&
        item.size === selectedSize
    );

    let updatedCart = [];

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id &&
        item.image === selectedImage &&
        item.size === selectedSize
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: selectedImage,
        size: selectedSize,
        quantity
      };

      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: selectedImage,
      size: selectedSize,
      quantity
    };

    saveBuyNowItem(buyNowItem);
    navigate("/checkout");
  };

  return (
    <>
      <Navbar
        currentUser={currentUser}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <QuickCart
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={(targetItem) => {
          const updatedCart = cart.filter(
            (item) =>
              !(
                item.id === targetItem.id &&
                item.image === targetItem.image &&
                item.size === targetItem.size
              )
          );

          setCart(updatedCart);
          saveCart(updatedCart);
        }}
      />

      <main>
        <div className="breadcrumb container">
          <Link to="/">Home</Link>
          <span> &gt; </span>
          <Link to="/">Shop</Link>
          <span> &gt; </span>
          <span className="current">{product.name}</span>
        </div>

        <section className="product-detail container">
          <div className="product-gallery">
            <img src={selectedImage} alt={product.name} className="main-image" />

            <div className="thumbs">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="thumb"
                  alt={product.name}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>

            <div className="rating">
              {"★".repeat(product.rating)} ({product.reviews})
            </div>

            <div className="price">
              <span className="new">${product.price}</span>
              <span className="old">${product.oldPrice}</span>
            </div>

            <p className="stock">Only {product.stock} items left in stock</p>

            <h4>Color</h4>
            <div className="colors">
              {product.colors.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="color option"
                  className={`color-option ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>

            <h4>Size</h4>
            <div className="sizes">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`size ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="qty">
              <button
                type="button"
                className="qty-minus"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>

              <input value={quantity} readOnly />

              <button
                type="button"
                className="qty-plus"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button className="add-cart" onClick={handleAddToCart}>
              Add To Cart
            </button>

            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </section>

        <section className="description container">
          <h2>Description</h2>
          <p>{product.description}</p>
        </section>

        <section className="specs container">
          <h2>Product Specifications</h2>

          <table>
            <tbody>
              <tr><td>Model</td><td>{product.specs.model}</td></tr>
              <tr><td>Display</td><td>{product.specs.display}</td></tr>
              <tr><td>Strap Color</td><td>{product.specs.strapColor}</td></tr>
              <tr><td>Strap Material</td><td>{product.specs.strapMaterial}</td></tr>
              <tr><td>Size</td><td>{product.specs.size}</td></tr>
              <tr><td>Touchscreen</td><td>{product.specs.touchscreen}</td></tr>
              <tr><td>Water Resistant</td><td>{product.specs.waterResistant}</td></tr>
              <tr><td>Compatible OS</td><td>{product.specs.compatibleOS}</td></tr>
            </tbody>
          </table>
        </section>

        <section className="similar container">
          <h2>Similar Products</h2>

          {similarProducts.length ? (
            <div className="product-grid">
              {similarProducts.slice(0, 4).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="similar-empty">
              No similar products found in this category.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}