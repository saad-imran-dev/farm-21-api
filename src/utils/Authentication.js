const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
const UnAuthorizedError = require("../Exceptions/unauthorizedError");

class Authentication {
  constructor() {
    if (!Authentication.instance) {
      this.auth = supabase.auth;
      Authentication.instance = this;
    }

    return Authentication.instance;
  }

  async signin(email, password) {
    const { data, error } = await this.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signup(email, password) {
    const { data, error } = await this.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log("Error while Signing up user: ", error);
      throw new Error("SignUp Error");
    }

    return data;
  }

  async verifyOTP(email, token) {
    const { data } = await this.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    return data;
  }

  async createUserToken(user) {
    const data = {
      time: Date(),
      userId: user.id,
      isExpert: user.isExpert,
    };

    const token = jwt.sign(data, process.env.JWT_SECRET_KEY);

    return token;
  }

  async verifyUserToken(token) {
    let jwtToken;
    let jwtError;

    try {
      jwtToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      jwtError = error;
    }

    if(jwtError){
      console.log(jwtError);
      throw new UnAuthorizedError("Invalid or Malformed JWT.");
    }

    return jwtToken;
  }
}

const authentication = new Authentication();

module.exports = authentication;
