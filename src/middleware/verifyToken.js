const { JsonWebTokenError } = require("jsonwebtoken");
const authentication = require("../supabase/Authentication");
const UnAuthorizedError = require("../Exceptions/unauthorizedError");

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];

  const data = await authentication.verifyUserToken(token);

  req.uid = data.userId;
  next();
};

module.exports = verifyToken;
