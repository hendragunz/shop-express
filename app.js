const path    = require('path');
const express = require("express");
const app     = express();

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes  = require('./routes/shop');

const port    = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

sequelize.sync()
  .then(result => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  });
