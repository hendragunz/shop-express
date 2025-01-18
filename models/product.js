
const fs = require('fs');
const path = require('path');

const filePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id           = id;
    this.title        = title;
    this.imageUrl     = imageUrl;
    this.description  = description;
    this.price        = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      // const productIndex = products.findByIndex(pd => pd.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(pd => pd.id === id);
      cb(product);
    });
  }
}