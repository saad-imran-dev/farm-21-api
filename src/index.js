require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const database = require("./data/Database");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

// Swagger UI config
const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Farm 21",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
