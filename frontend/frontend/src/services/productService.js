const API_URL = "http://localhost:5000/api/products";

export async function fetchProducts(category = "") {
  const url = category
    ? `${API_URL}?category=${encodeURIComponent(category)}`
    : API_URL;

  const res = await fetch(url);
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}