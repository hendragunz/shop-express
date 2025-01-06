const path    = require('path');
const express = require("express");
const app     = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes  = require('./routes/shop');

const port    = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.render("404", { docTitle: "Page Not Found" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
