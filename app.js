const path    = require('path');
const express = require("express");
const app     = express();

const adminData = require('./routes/admin');
const shopRoutes  = require('./routes/shop');

const port    = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
