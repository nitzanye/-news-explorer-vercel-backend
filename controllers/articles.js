const Article = require("../models/article");
const { SUCCESS_OK, SUCCESS_CREATED } = require("../utils/constants");
const NotFoundError = require("../errors/not-found-error");
const InvalidDataError = require("../errors/invalid-data-error");
const ForbiddenError = require("../errors/forbidden-error");

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(new NotFoundError("Data is not found"))
    .then((articles) => res.status(SUCCESS_OK).send(articles))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((newArticle) => res.status(SUCCESS_CREATED).send(newArticle))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new InvalidDataError("Invalid data"));
      }
      return next(err);
    });
};

const deleteArticle = (req, res, next) => {
  // find article
  Article.findById(req.params.articleId)
    .orFail()
    .then((article) => {
      if (!(article.owner.toString() === req.user._id)) {
        console.log(article.owner);
        throw new ForbiddenError("Action forbidden");
      }

      // delete the article
      Article.findByIdAndDelete(req.params.articleId)
        .orFail()
        .then((deletedArticle) => res.status(SUCCESS_OK).send(deletedArticle))
        .catch((err) => {
          if (err.name === "CastError") {
            return next(new InvalidDataError("Invalid data"));
          }
          if (err.name === "DocumentNotFoundError") {
            return next(new NotFoundError("Article not found"));
          }
          return next(err);
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new InvalidDataError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Article not found"));
      }
      return next(err);
    });
};

module.exports = { getArticles, createArticle, deleteArticle };
