import express from "express";
import * as shopRoutes from "../controllers/shop.js";
import isAuth from "../middleware/is-auth.js";


const router = express.Router();

router.get("/", shopRoutes.getIndex);

router.get("/products", shopRoutes.getProducts);

router.get("/products/:productId", shopRoutes.getProduct);

router.get("/cart", isAuth, shopRoutes.getCart);

router.post("/cart", isAuth, shopRoutes.postCart);

router.post("/cart-delete-item", isAuth, shopRoutes.postCartDeleteProduct);

router.get("/checkout", isAuth, shopRoutes.getCheckout);

router.get("/orders", isAuth, shopRoutes.getOrders);

router.post("/create-order", isAuth, shopRoutes.postOrder);

export default router;