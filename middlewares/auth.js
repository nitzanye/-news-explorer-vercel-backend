const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require("../errors/unauthorized-error");
const { privateKey } = require("../utils/configuration");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("You are not authorized"));
  }

  let payload;
  const token = authorization.replace("Bearer ", "");
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : privateKey
    );
  } catch (err) {
    return next(new UnauthorizedError("You are not authorized"));
  }

  // assigning the payload to the request object
  req.user = payload;

  // sending the request to the next middleware
  return next();
};

module.exports = auth;
