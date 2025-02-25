import express from 'express';
import * as adminRoutes from "../controllers/admin.js";
import isAuth from '../middleware/is-auth.js';
import { body } from 'express-validator';

const router = express.Router();

router.get("/products", isAuth, adminRoutes.getProducts);

router.get("/add-product", isAuth, adminRoutes.getAddProduct);

router.post("/add-product", [
  body('title')
    .isString()
    .isLength({ min: 3})
    .trim(),
  body('imageUrl').isURL().trim(),
  body('price').isFloat(),
  body('description').isLength({min: 5, max: 400}).trim()
], isAuth, adminRoutes.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminRoutes.getEditProduct);

router.post("/edit-product", [
  body('title')
    .isString()
    .isLength({ min: 3})
    .trim(),
  body('imageUrl').isURL().trim(),
  body('price').isFloat(),
  body('description').isLength({min: 5, max: 400}).trim()
], isAuth, adminRoutes.postEditProduct);

router.post("/delete-product", isAuth, adminRoutes.postDeleteProduct);

export default router;
