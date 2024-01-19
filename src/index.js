require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const database = require("./data/Database");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./config/swagger");

const app = express();
const port = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

// SwaggerUI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// load all routes
fs.readdir("./src/routes", (err, files) => {
  if (err) {
    console.log(`Error occured while loading routes: ${err}`);
    process.exit(-1);
  }

  files.forEach((file) => {
    app.use("/api", require(`./routes/${file}`));
    console.log(`Succesfully loaded route ${file}`);
  });

  console.log(`--> All routes loaded`);
});

// Sync Db & Models
database.sync();

// listening
app.listen(port, () => {
  console.log("Listening on port ", port);
});
