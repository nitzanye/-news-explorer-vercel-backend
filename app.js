const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { database } = require('./utils/configuration');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const serverErrorHandler = require('./middlewares/server-error-handler');
const limiter = require('./utils/rate-limiter');
const { pageNotFound } = require('./controllers/page-not-found');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : database);

app.use(bodyParser.json());
const mainRoute = require('./routes/index');

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cors());
app.options('*', cors());

app.use('/', mainRoute);

app.use(errorLogger);
app.use(errors());
app.use(serverErrorHandler);

app.use('*', pageNotFound);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
