const multer = require("multer");
const BadRequestError = require("./badRequestError");
const CustomError = require("./customError");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(error.statusCode).json({
      status: "fail",
      message: "Something went wrong. Please, try again.",
    });
  }
};

const handleFileHandlingError = (error) => {
  if (error instanceof multer.MulterError){
    if (error.code === "LIMIT_UNEXPECTED_FILE"){
      return new BadRequestError("Wrong file upload field name. Check swagger documentation and try again")
    }
    return new CustomError("Error ocurred while processing file", 500)
  }
  
  return error
}

const handler = (error, req, res, next) => {
  const err = handleFileHandlingError(error)

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    devErrors(res, err);
  } else {
    prodErrors(res, err);
  }
};

module.exports = handler;
