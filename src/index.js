require("dotenv").config();
require("express-async-errors")
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const database = require("./data/database");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./config/swagger");
const exceptionsHandler = require("./Exceptions/exceptionsHandler");
const CustomError = require("./Exceptions/customError");

const app = express();
const port = process.env.PORT;

// middleware
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Sync Db & Models
database.sync();

// SwaggerUI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// load all routes
const files = fs.readdirSync("./src/routes");

files.forEach((file) => {
  const entityName = file.split(".")[0];
  app.use(`/api/${entityName}/`, require(`./routes/${file}`));
  console.log(`Succesfully loaded route ${file}`);
});
console.log(`--> All routes loaded`);

// Global Exception handling
app.all("*", (req, res, next) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on server`, 404);
  next(err);
});

app.use(exceptionsHandler);

// listening
app.listen(port, () => {
  console.log("Listening on port ", port);
});
