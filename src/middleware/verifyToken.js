const { JsonWebTokenError } = require("jsonwebtoken");
const authentication = require("../supabase/Authentication");

const verifyToken = async (req, res, next) => {
  console.log("--> Verifying jwt token");

  try {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    const data = await authentication.verifyUserToken(token);
    
    req.uid = data.userId;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).send("Unauthorized");
    }
    res.sendStatus(500);
  }
};

module.exports = verifyToken;
