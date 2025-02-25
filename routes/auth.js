import express from "express";
import { check, body } from "express-validator";
import User from "../models/user.js";
import * as authRoutes from "../controllers/auth.js";

const router = express.Router();

router.get('/login', authRoutes.getLogin);

router.post('/login', authRoutes.postLogin);

router.get("/signup", authRoutes.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail()
      .custom((value, { req }) => {
        // if (value === "test@example.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;

        return User.findOne({ where: { email: value } })
          .then((user) => {
            if (user) {
              // req.flash('error', 'E-Mail already exists, please pick a different one or go to login');
              // return res.redirect('/login');
              return Promise.reject("E-Mail already exists, please pick a different one.");
            };
          })
      }),
    body(
      'password',
      "Plese enter a password with only numbers and text and at least 8 characters"
    ).isLength({min: 8}).isAlphanumeric().trim(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation have to match!")
      }
      return true;
    })
  ],
  authRoutes.postSignup
);

router.post("/logout", authRoutes.postLogout);

router.get("/reset-password", authRoutes.getResetPassword);

router.post("/reset-password", authRoutes.postResetPassword);

router.get("/reset-password/:resetToken", authRoutes.getNewPassword);

router.post("/update-password", authRoutes.postUpdatePassword);

export default router;