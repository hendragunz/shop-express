const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
   Product.findAll()
     .then((products) => {
       res.render("shop/product-list", {
         prods: products,
         docTitle: "All products",
         path: "/",
       });
     })
     .catch((err) => {
       console.log(err);
     });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      docTitle: product.title,
      path: "/products"
    });
  });
};

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    docTitle: "Welcome to My Shop",
    path: "/",
  });
}

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart => {
    return cart.getProducts()
      .then(products => {
        res.render("shop/cart", {
          docTitle: "Products in your Cart",
          path: "/cart",
          products: products
        });
      });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart().then(cart => {
      fetchedCart = cart;
      return cart.getProducts({where: {id: productId}});
    }).then(products => {
      let product;

      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(productId);

    }).then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    }).then(() => {
      res.redirect("/cart");
    }).catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user.getCart().then(cart => {
    return cart.getProducts({where: {id: productId}})
  }).then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  }).then(result => {
    res.redirect("/cart");
  }).catch(err => console.log(err));
};


exports.postOrder = (req, res, next) => {
  let fetchedCart;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = {  quantity: product.cartItem.quantity };
            return product;
          }))
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/order')
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/ceckout", {
    docTitle: "Yay! Let's take it home",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render("shop/orders", {
        docTitle: "Here is your orders",
        path: "/orders",
        orders: orders
      });
    })
    .catch(err => console.log(err));
};