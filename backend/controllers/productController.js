const products = require("../data/products");

const getProducts = (req, res) => {
  const { category } = req.query;

  if (category) {
    const filteredProducts = products.filter(
      (product) => product.category === category
    );

    return res.json({
      success: true,
      products: filteredProducts
    });
  }

  return res.json({
    success: true,
    products
  });
};

const getProductById = (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  return res.json({
    success: true,
    product
  });
};

module.exports = {
  getProducts,
  getProductById
};