const path    = require('path');
const express = require("express");
const app     = express();

const errorController = require('./controllers/error');

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

// app.use((req, res, next) => {
//   res.status(404).render("404", { docTitle: "Page Not Found" });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
