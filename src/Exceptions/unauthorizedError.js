const CustomError = require("./customError");

class UnAuthorizedError extends CustomError {
  constructor(url) {
    super(`Unauthorized`, 401);
  }
}

module.exports = UnAuthorizedError;
