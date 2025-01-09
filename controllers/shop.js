const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/products", {
      prods: products,
      docTitle: "All Products",
      path: "/",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Welcome to My Shop",
      path: "/",
    });
  });
}

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Yay! Let's take it home",
    path: "/cart",
  });
};


exports.getCheckout = (req, res, next) => {
  res.render("shop/ceckout", {
    docTitle: "Yay! Let's take it home",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Here is your orders",
    path: "/orders",
  });
};