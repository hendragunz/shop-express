const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/admin');
  }

  const productId = req.params.productId;
  req.user.getProducts({where: {id: productId}})
    .then((products) => {
      res.render("admin/edit-product", {
        docTitle: "Add product",
        path: "/admin/edit-product",
        editing: editMode,
        product: products[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImageUrl = req.body.imageUrl;

  req.user.getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  // product attribute
  const title       = req.body.title;
  const description = req.body.description;
  const imageUrl    = req.body.imageUrl;
  const price     = req.body.price;

  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(result => {
    res.redirect("/admin/products");
  }).catch(err => {
    console.log(err);
  });
};


exports.postDeleteProduct = (req, res, next) => {
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
}
