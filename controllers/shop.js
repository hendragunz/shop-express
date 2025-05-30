import * as fs from "fs";
import * as path from "path";
import PDFDocument from "pdfkit";
import Product from "../models/product.js";
import mg from "../util/mail.js";

const ITEMS_PER_PAGE = 2;

export const getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let productsCount;

  Product.count()
    .then((results) => {
      productsCount = results;
      return Product.findAll({
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
      });
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All products",
        path: "/",
        totalProducts: productsCount,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < productsCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      docTitle: product.title,
      path: "/products",
    });
  });
};

export const getIndex = (req, res, next) => {
  const page = +req.query.page  || 1;
  let productsCount;

  Product.count().then((results) => {
    productsCount = results;
    return Product.findAll({
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    });
  })
  .then((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All products",
      path: "/",
      totalProducts: productsCount,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < productsCount,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE)
    });
  })
  .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

export const getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        return req.user.createCart();
      }
      return cart;
    })
    .then((cart) => {
      return cart.getProducts().then((products) => {
        res.render("shop/cart", {
          docTitle: "Products in your Cart",
          path: "/cart",
          products: products,
        });
      });
    });
};

export const postCart = (req, res, next) => {
  console.log(req);
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      console.log(cart);
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
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
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const postOrder = (req, res, next) => {
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// export const getCheckout = (req, res, next) => {
//   res.render("shop/ceckout", {
//     docTitle: "Yay! Let's take it home",
//     path: "/checkout",
//   });
// };

export const getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        docTitle: "Here is your orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = "invoice-" + orderId + ".pdf";
  const invoicePath = path.join("data", "invoices", invoiceName);

  req.user
    .getOrders({ where: { id: orderId }})
    .then((orders) => {
      const order = orders[0];

      if (!order) {
        return next(new Error("No order found."));
      }

      (async () => {
        const pdfDoc = new PDFDocument();
        let totalPrice = 0;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'inline; filename="' + invoiceName + '"'
        );

        const writeStream = fs.createWriteStream(invoicePath);
        pdfDoc.pipe(writeStream);
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text("Invoice", {
          underline: true
        });
        pdfDoc.text("------------------------------------------")
        const orderItems = await order.getOrderItems({ include: Product })

        orderItems.forEach(orderItem => {
          totalPrice += orderItem.quantity * orderItem.product.price;
          pdfDoc.text(orderItem.product.title + ' - ' + orderItem.quantity + ' x $' + orderItem.product.price)
        })

        pdfDoc.text("------------------------------------------");
        pdfDoc.text("Total Price: " + totalPrice);
        pdfDoc.end();
      })();
    })
    .catch((err) => next(err));
};
