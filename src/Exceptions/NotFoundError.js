const CustomError = require("./customError");

class NotFoundError extends CustomError {
  constructor() {
    super(`NotFound`, 404);
  }
}

module.exports = NotFoundError;
