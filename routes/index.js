const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

// routes
const userRouter = require("./users");
const articlesRouter = require("./articles");
const signin = require("./signin");
const signup = require("./signup");

router.use("/signup", signup);
router.use("/signin", signin);

// protect routes
// authorization (the two routes above, don't need to be protected by authorization.)
router.use(auth);

router.use("/users", userRouter);
router.use("/articles", articlesRouter);

module.exports = router;
