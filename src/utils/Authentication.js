const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

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
      console.log("Error while Signing in user: ", error);
      throw new Error("SignIn Error");
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
    const key = process.env.JWT_SECRET_KEY;

    const data = {
      time: Date(),
      userId: user.id,
      isExpert: user.isExpert,
    };

    const token = jwt.sign(data, key);

    return token;
  }
}

const authentication = new Authentication();

module.exports = authentication;
