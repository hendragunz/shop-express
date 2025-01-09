const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  // product attribute
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;

  const product = new Product(title, imageUrl, description, price);
  product.save();

  res.redirect("/admin/products");
};
