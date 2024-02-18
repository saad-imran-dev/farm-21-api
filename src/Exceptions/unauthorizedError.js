const CustomError = require("./customError");

class UnAuthorizedError extends CustomError {
  constructor(message = "") {
    super(`Unauthorized. ` + message, 401);
  }
}

module.exports = UnAuthorizedError;
