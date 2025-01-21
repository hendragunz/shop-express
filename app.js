import path from 'path';
import { dirname } from 'path';
import express from 'express';

const app     = express();

import * as errorController from "./controllers/error.js";
import sequelize from './util/database.js';
import Product from './models/product.js';
import User from './models/user.js';
import Cart from './models/cart.js';
import CartItem from './models/cart-item.js';
import Order from './models/order.js';
import OrderItem from './models/order-item.js';

app.set('view engine', 'pug');
app.set('views', 'views');

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js"

const port    = 8080;
import bodyParser from 'body-parser';

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


sequelize.sync()
  .then(result => {
    return User.findByPk(1)
  }).then(user => {
    if (!user) {
      return User.create({name: 'Hendra', email: 'hendragunz@codecampz.com'});
    }
    return user;
  }).then(user => {
    user.getCart()
      .then(cart => {
        if (!cart) {
          return user.createCart();
        }
        return cart;
      }).catch(err => console.log(err));
  }).then(cart => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }).catch(err => console.log(err));