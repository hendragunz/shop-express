import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const getLogin = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
  });
};

export const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

export const postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

  console.log(email);

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        req.flash('error', 'E-Mail already exists, please pick a different one or go to login');
        return res.redirect('/login');
      };
      return bcrypt
        .hash(password, 12)
        .then((hash) => {
          return User.create({ name: name, email: email, password: hash });
        })
        .then((user) => {
          return res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
}

export const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        console.log(user);
      } else {
        return User.create();
      }
    })
    .catch((err) => console.log(err));
};
