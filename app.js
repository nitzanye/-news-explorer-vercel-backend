const express = require('express');

const app = express();

// const mongoose with new project
// mongoose.connect('mongodb://localhost:27017/news-explorer', {
//   useNewUrlParser: true,
// });

const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const mongoose = require('mongoose');
const { database } = require('./utils/configuration');

// const { PORT = 3000 } = process.env;

// mongoose.connect(database, {
//   useNewUrlParser: true,
// });

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : database);

// app.use(express.json());
app.use(bodyParser.json());

require('dotenv').config();

const limiter = require('./utils/rate-limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const serverErrorHandler = require('./middlewares/server-error-handler');
const { createUser, login } = require('./controllers/users');
const { validateUser, validateLogin } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const { pageNotFound } = require('./controllers/page-not-found');
const userRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

// enable requests for all routes
// must come before the route handlers

app.use(cors());
app.options('*', cors());

// server crash testing
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// register
// creates a user with the passed email, password, and name in the body
app.post('/signup', validateUser, createUser);

// login
// checks the email and password passed in the body and returns a JWT
app.post('/signin', validateLogin, login);

// authorization (the two routes above, don't need to be protected by authorization.)
app.use(auth);

app.use('/', userRouter);
app.use('/', articlesRouter);

// must come after the route handlers and before the error handlers
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// centralized error handler
app.use(serverErrorHandler);

app.use('*', pageNotFound);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
