const { celebrate, Joi } = require("celebrate");

const validator = require("validator");

function validateUrl(string) {
  if (!validator.isURL(string)) {
    throw new Error("Invalid URL");
  }
  return string;
}

function validateEmail(string) {
  if (!validator.isEmail(string)) {
    throw new Error("Invalid Email");
  }
  return string;
}

const authValidation = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const articleValidationId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
});

const newArticleValidation = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateUrl),
    image: Joi.string().required().custom(validateUrl),
  }),
});

module.exports = {
  validateUrl,
  validateEmail,
  authValidation,
  validateUser,
  validateLogin,
  articleValidationId,
  newArticleValidation,
};
