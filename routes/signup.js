const express = require("express");

const router = express.Router();

const { createUser } = require("../controllers/users");
const { validateUser } = require("../middlewares/validations");

// register
// creates a user with the passed email, password, and name in the body
router.post("/", validateUser, createUser);

module.exports = router;
