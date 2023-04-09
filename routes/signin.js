const express = require("express");

const router = express.Router();

const { login } = require("../controllers/users");
const { validateLogin } = require("../middlewares/validations");

// checks the email and password passed in the body and returns a JWT
router.post("/", validateLogin, login);

module.exports = router;
