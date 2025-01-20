import express from 'express';

import * as adminRoutes from "../controllers/admin.js";

const router = express.Router();

router.get("/products", adminRoutes.getProducts);

router.get("/add-product", adminRoutes.getAddProduct);

router.post("/add-product", adminRoutes.postAddProduct);

router.get("/edit-product/:productId", adminRoutes.getEditProduct);

router.post("/edit-product", adminRoutes.postEditProduct);

router.post("/delete-product", adminRoutes.postDeleteProduct);

export default router;
