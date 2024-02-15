require("dotenv").config();
require("express-async-errors")
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const database = require("./data/Database");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./config/swagger");
const exceptionsHandler = require("./Exceptions/exceptionsHandler");
const UrlNotFoundError = require("./Exceptions/urlNotFoundError");

const app = express();
const port = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

// Sync Db & Models
database.sync();

// SwaggerUI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// load all routes
const files = fs.readdirSync("./src/routes");

files.forEach((file) => {
  app.use("/api", require(`./routes/${file}`));
  console.log(`Succesfully loaded route ${file}`);
});
console.log(`--> All routes loaded`);

// Global Exception handling
app.all("*", (req, res, next) => {
  const err = new UrlNotFoundError(req.originalUrl);
  next(err);
});

app.use(exceptionsHandler);

// listening
app.listen(port, () => {
  console.log("Listening on port ", port);
});
