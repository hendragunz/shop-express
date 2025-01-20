import express from "express";

import * as shopRoutes from "../controllers/shop.js";

const router = express.Router();

router.get("/", shopRoutes.getIndex);

router.get("/products", shopRoutes.getProducts);

router.get("/products/:productId", shopRoutes.getProduct);

router.get("/cart", shopRoutes.getCart);

router.post("/cart", shopRoutes.postCart);

router.post("/cart-delete-item", shopRoutes.postCartDeleteProduct);

router.get("/checkout", shopRoutes.getCheckout);

router.get("/orders", shopRoutes.getOrders);

router.post("/create-order", shopRoutes.postOrder);

export default router;