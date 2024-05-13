const authentication = require("../utils/Authentication");
const userValidation = require("../validation/user.validation");
const userRepo = require("../data/user.repo");
const validationHandler = require("../validation/validationHandler")
const { ValidationError } = require("joi");
const { AuthApiError } = require("@supabase/supabase-js");
const storage = require("../utils/Storage");
const BadRequestError = require("../Exceptions/badRequestError");
const TestamonialService = require("../services/testamonial.service");
const supabase = require("../config/supabase");

class UserController {
  constructor() {
    this.testamonialService = new TestamonialService()
  }

  signin = async (req, res) => {
    console.info("--> Signin User");

    try {
      const { email, password } = req.body;

      await userValidation.auth.validateAsync(req.body);

      const auth = await authentication.signin(email, password);

      const user = await userRepo.get(auth.user.id);
      console.log(auth.user, user, "user")

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

  googleSignin = async (req, res) => {
    const { userInfo } = req.body
    console.log(userInfo)
    if (userInfo.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.idToken,
      })
      console.log(error, data)
    } else {
      throw new Error('no ID token present!')
    }

    console.log(data)

    res.send("Done")
  }

  signup = async (req, res) => {
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

  verify = async (req, res) => {
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

  getUser = async (req, res) => {
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

  getUserById = async (req, res) => {
    console.log("--> GET user details by id")

    const { id } = req.params

    const user = await userRepo.get(id)
    if (!user) throw new BadRequestError("User doesn't exist")
    const profile = await userRepo.getProfile(id)
    let rank = await userRepo.getRank(id)
    let url = await storage.getUrl(profile?.fileName)

    if (url && url.publicUrl.split('/').slice(-1)[0] === "undefined") {
      url = undefined;
    }

    res.status(200).send({
      ...user.dataValues,
      profile: url?.publicUrl,
      rank: rank?.rank,
      giveTestamonial: await this.testamonialService.canGiveTestamonial(req.uid, id)
    })
  }

  getUserCommunities = async (req, res) => {
    console.info("--> GET User Communities");

    const communities = await userRepo.getUserCommunities(req.uid);

    res.status(200).send({ communities });
  }

  createUserProfile = async (req, res) => {
    console.log("--> Add User Profile");

    const { desc } = req.body

    await validationHandler(req.body, userValidation.profile)

    if (desc) {
      await userRepo.updateDesc(desc, req.uid)
    }

    if (req.file) {
      const profile = await userRepo.getProfile(req.uid)

      if (profile) {
        await storage.deleteFile(profile.fileName)
        await userRepo.deleteProfile(req.uid)
        console.log("olf profile deleted")
      }

      console.log(req.file, "req file")
      const fileName = req.uid + "/" + Date.now() + "_" + req.file.originalname
      console.log("upload new file")
      await storage.uploadFile(fileName, req.file.buffer);
      console.log("create new attachment")
      await userRepo.addProfile(fileName, req.uid)
      console.log("new profile updated")
    }

    console.log("Done")
    res.sendStatus(200);
  }
}

const userController = new UserController()

module.exports = userController;
