const authentication = require("../supabase/Authentication");
const userValidation = require("../validation/user.validation");
const userRepo = require("../data/user.repo");
const { ValidationError } = require("joi");
const { AuthApiError } = require("@supabase/supabase-js");
const storage = require("../supabase/Storage");
const { v4 } = require('uuid')

class userController {
  static async signin(req, res) {
    console.info("--> Signin User");

    try {
      const { email, password } = req.body;

      await userValidation.auth.validateAsync(req.body);

      const auth = await authentication.signin(email, password);

      const user = await userRepo.getUserWithEmail(auth.user.email);

      const token = await authentication.createUserToken(user);

      res.status(200).send({ token });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).send("Invalid inputs given");
      } else if (error instanceof AuthApiError) {
        res.status(400).send(error.message);
      } else {
        res.sendStatus(500);
      }
      console.error(`Error: ${error}`);
    }
  }

  static async signup(req, res) {
    console.info("--> Signup User");

    try {
      const { email, password } = req.body;

      await userValidation.auth.validateAsync(req.body);

      if (await userRepo.getUserWithEmail(email)) {
        return res.status(400).send("User already exists");
      }

      await authentication.signup(email, password);

      res.status(200).send("User signed up. Please verify user.");
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).send("Invalid inputs given");
      } else {
        res.sendStatus(500);
      }
      console.error(`Error: ${error}`);
    }
  }

  static async verify(req, res) {
    console.info("--> Verify User");

    try {
      const { email, token, name } = req.body;

      await userValidation.verifyOTP.validateAsync(req.body);

      const data = await authentication.verifyOTP(email, token);
      if (!data.user) {
        throw new AuthApiError("Invalid Token");
      }

      await userRepo.createUser(data.user.id, name, email);

      res.status(200).send("User verified.");
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).send("Invalid inputs given");
      } else if (error instanceof AuthApiError) {
        res.status(400).send(error.message);
      } else {
        res.sendStatus(500);
      }
      console.error(`Error: ${error}`);
    }
  }

  static async getUserCommunities(req, res) {
    console.info("--> GET User Communities");

    try {
      const communities = await userRepo.getUserCommunities(req.uid);

      res.status(200).send({ communities });
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error}`);
    }
  }

  static async getUserProfile(req, res) {
    console.info("--> GET User Profile");

    try {
      const profile = await userRepo.getProfile(req.uid)

      const url = await storage.getUrl(profile?.fileName)

      if (url.publicUrl.split('/').slice(-1)[0] === "undefined") {
        return res.sendStatus(404)
      }

      res.status(200).send(url);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error}`);
    }
  }

  static async createUserProfile(req, res) {
    console.info("--> Add User Profile");

    try {
      const profile = await userRepo.getProfile(req.uid)
      
      if (profile) {
        await storage.deleteFile(profile.fileName)
        await userRepo.deleteProfile(req.uid)
      }
      
      const fileId = v4()
      const fileName = fileId + req.file.originalname
      await storage.uploadFile(fileName, req.file.buffer);

      await userRepo.addProfile(fileId, fileName, req.uid)

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error}`);
    }
  }
}

module.exports = userController;
