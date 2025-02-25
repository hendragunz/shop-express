import Product from "../models/product.js";
import { validationResult } from "express-validator";

export const getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/admin");
  }

  const productId = req.params.productId;
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      res.render("admin/edit-product", {
        docTitle: "Add product",
        path: "/admin/edit-product",
        editing: editMode,
        hasError: false,
        product: products[0],
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export  const postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImageUrl = req.body.imageUrl;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {
        id: productId,
        title: updatedTitle,
        description: updatedDescription,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
      },
    });
  }

  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postAddProduct = (req, res, next) => {
  // product attribute
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      },
    });
  }

  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};


export const postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });

  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
