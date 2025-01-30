import express from "express";

import * as authRoutes from "../controllers/auth.js";

const router = express.Router();

router.get('/login', authRoutes.getLogin);

router.post('/login', authRoutes.postLogin);

router.get("/signup", authRoutes.getSignup);

router.post("/signup", authRoutes.postSignup);

router.post("/logout", authRoutes.postLogout);

router.get("/reset-password", authRoutes.getResetPassword);

router.post("/reset-password", authRoutes.postResetPassword);

router.get("/reset-password/:resetToken", authRoutes.getNewPassword);

router.post("/update-password", authRoutes.postUpdatePassword);

export default router;