const express = require("express");
const helmet = require("helmet");

require("dotenv").config();
require("./db");

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const serverErrorHandler = require("./middlewares/server-error-handler");
const limiter = require("./utils/rate-limiter");
// const { pageNotFound } = require("./controllers/page-not-found");

app.use(bodyParser.json());
const { PORT = 3000 } = process.env;
const mainRoute = require("./routes/index");

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cors());
app.options("*", cors());

app.use("/", mainRoute);

app.use(errorLogger);
app.use(errors());
app.use(serverErrorHandler);

// app.use("*", pageNotFound);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
