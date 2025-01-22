import express from 'express';
import * as adminRoutes from "../controllers/admin.js";
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get("/products", isAuth, adminRoutes.getProducts);

router.get("/add-product", isAuth, adminRoutes.getAddProduct);

router.post("/add-product", isAuth, adminRoutes.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminRoutes.getEditProduct);

router.post("/edit-product", isAuth, adminRoutes.postEditProduct);

router.post("/delete-product", isAuth, adminRoutes.postDeleteProduct);

export default router;
