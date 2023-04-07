const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SUCCESS_OK } = require("../utils/constants");
const { privateKey } = require("../utils/configuration");
const NotFoundError = require("../errors/not-found-error");
const InvalidDataError = require("../errors/invalid-data-error");
const ConflictError = require("../errors/conflict-error");

// const privateKey = "some-secret-key";

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

const getCurrentUserData = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError("Data is not found"))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("This email is already exist");
      } else {
        return bcrypt.hash(password, SALT_ROUNDS);
      }
    })
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(SUCCESS_OK).send({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(new InvalidDataError("Invalid data"));
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCrendentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : privateKey,
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getCurrentUserData,
  createUser,
  login,
};
