const CustomError = require("./customError");

class UrlNotFoundError extends CustomError {
  constructor(url) {
    super(`Can't find ${url} on server`, 404);
  }
}

module.exports = UrlNotFoundError;
