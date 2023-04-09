const express = require("express");

const router = express.Router();
const {
  authValidation,
  articleValidationId,
  newArticleValidation,
} = require("../middlewares/validations");
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");

// returns all articles saved by the user
router.get("/", authValidation, articleValidationId, getArticles);

// creates an article with the passed:
// keyword, title, text, date, source, link, and image in the body
router.post("/", authValidation, newArticleValidation, createArticle);

// deletes the stored article by _id
router.delete(
  "/:articleId",
  authValidation,
  articleValidationId,
  deleteArticle
);

module.exports = router;
