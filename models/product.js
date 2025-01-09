
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
  constructor(title, imageUrl, description, price) {
    this.title        = title;
    this.imageUrl     = imageUrl;
    this.description  = description;
    this.price        = price;
  }

  save() {
    const filePath = path.join(
      path.dirname(require.main.filename),
      'data',
      'products.json'
    );

    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
}