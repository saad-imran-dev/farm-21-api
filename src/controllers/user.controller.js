const authentication = require("../utils/Authentication");
const userValidation = require("../validation/user.validation");
const userRepo = require("../data/user.repo");
const validationHandler = require("../validation/validationHandler")
const { ValidationError } = require("joi");
const { AuthApiError } = require("@supabase/supabase-js");
const storage = require("../utils/Storage");
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

  static async getUser(req, res) {
    console.log("--> GET user details")

    const user = await userRepo.get(req.uid)
    const profile = await userRepo.getProfile(req.uid)
    let rank = await userRepo.getRank(req.uid)
    let url = await storage.getUrl(profile?.fileName)

    if (url && url.publicUrl.split('/').slice(-1)[0] === "undefined") {
      url = undefined;
    }

    res.status(200).send({ ...user.dataValues, profile: url?.publicUrl, rank: rank?.rank })
  }

  static async getUserCommunities(req, res) {
    console.info("--> GET User Communities");

    const communities = await userRepo.getUserCommunities(req.uid);

    res.status(200).send({ communities });
  }

  static async createUserProfile(req, res) {
    console.log("--> Add User Profile");

    const { desc } = req.body

    await validationHandler(req.body, userValidation.profile)
    console.log("validation done")

    if (desc) {
      await userRepo.updateDesc(desc, req.uid)
      console.log("Desc updated")
    }

    if (req.file) {
      const profile = await userRepo.getProfile(req.uid)
      console.log("got profile")

      if (profile) {
        await storage.deleteFile(profile.fileName)
        await userRepo.deleteProfile(req.uid)
        console.log("olf profile deleted")
      }

      const fileName = req.uid + "/" + Date.now() + "_" + req.file.originalname
      await storage.uploadFile(fileName, req.file.buffer);
      await userRepo.addProfile(fileName, req.uid)
      console.log("new profile updated")
    }

    res.sendStatus(200);
    console.log("res 200")
  }
}

module.exports = userController;
