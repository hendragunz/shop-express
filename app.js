import path from 'path';
import { dirname } from 'path';
import express from 'express';
import session from "express-session";
import SequelizeSessionInit from "connect-session-sequelize";
import csrf from "csurf";
import flash from "connect-flash";
import helmet from "helmet";
import compression from 'compression';
import morgan from 'morgan';


const app = express();

const SequelizeStore = SequelizeSessionInit(session.Store);

const csrfProtection = csrf();

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

const port    = process.env.PORT || 8080;
import bodyParser from 'body-parser';

// app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    proxy: false,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);
app.use(flash());

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.flash = req.flash();
  console.log(res.locals.flash);
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  console.log(req.session);

  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
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
  .then(cart => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }).catch(err => console.log(err));