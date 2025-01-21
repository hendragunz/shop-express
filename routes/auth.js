import express from "express";

import * as authRoutes from "../controllers/auth.js";

const router = express.Router();

router.get('/login', authRoutes.getLogin);

router.post('/login', authRoutes.postLogin);

router.get("/signup", authRoutes.getSignup);

router.post("/signup", authRoutes.postSignup);

router.post("/logout", authRoutes.postLogout);

export default router;