import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import mg from "../util/mail.js";
import { Op } from "sequelize";

export const getLogin = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
  });
};

export const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup"
  });
};

export const postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

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
          mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `no-reply@${process.env.MAILGUN_DOMAIN}`,
            to: [user.email],
            subject: "Welcome to My Test Shop",
            text: "Testing some Mailgun awesomness!",
            html: "<h1>Your account successfully created</h1>",
          })
          .then(result => {
            return res.redirect("/login");
          })
          .catch(err => console.log(err));
        });
    })
    .catch((err) => console.log(err));
}

export const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }

      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid password");
          res.redirect('/login');
        }).catch(err => {
          console.log(err);
          req.flash("error", "Invalid authentication");
          res.redirect("/login");
        })
    })
};


export const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};


export const getResetPassword = (req, res, next) => {
  res.render("auth/reset-password", {
    path: "/reset-password",
    pageTitle: "Reset Your Password",
  });
};


export const postResetPassword = (req, res, next) => {
  const email = req.body.email;

  crypto
    .randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect("/reset-password");
      }

      User.findOne({ where: { email: email } })
        .then((user) => {
          if (!user) {
            req.flash(
              "error",
              "Invalid email or user not found when trying to reset password"
            );
            return res.redirect("/reset-password");
          }

          const token = buffer.toString("hex");
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
          return user.save();
        })
        .then((result) => {
          mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `no-reply@${process.env.MAILGUN_DOMAIN}`,
            to: [result.dataValues.email],
            subject: "Reset Password Request",
            text: `You requested a password reset. Click this link to reset your password: http://${req.headers.host}/reset-password/${result.dataValues.resetToken}`,
            html: `<h1>Reset Password Request</h1>
            <p>Click this link to reset your password: <a href="http://${req.headers.host}/reset-password/${result.dataValues.resetToken}">Reset Password</a></p>`,
          });
          req.flash(
            "success",
            "Check your email for password reset instructions"
          );
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })

};

export const getNewPassword = (req, res, next) => {
  const token = req.params.resetToken;
  User.findOne({ where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } } })
   .then((user) => {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired");
        return res.redirect("/login");
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Reset Your Password",
        userId: user.id,
        token: token,
      });
    })
    .catch((err) => console.log(err));
}

export const postUpdatePassword = (req, res, next) => {
  const token = req.body.token;
  const userId = req.body.userId;
  const newPassword = req.body.password;
  let resetUser;

  User.findOne({
    where: { id: userId, resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired");
        return res.redirect("/login");
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = null;
      return resetUser.save();
    }).then((result) => {
      req.flash("success", "Password updated successfully. You can now log in");
      res.redirect("/login");
    })
    .catch((err) => console.log(err));

}