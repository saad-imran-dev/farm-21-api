const { ValidationError } = require("joi");
const communityRepo = require("../data/community.repo");
const communityValidation = require("../validation/community.validation");
const storage = require("../utils/Storage");
const { v4 } = require("uuid");
const UnAuthorizedError = require("../Exceptions/unauthorizedError");
const NotFoundError = require("../Exceptions/NotFoundError");

class communityController {
  static async createCommunity(req, res) {
    console.info("--> Create Community");

    const { name, desc } = req.body;

    await communityValidation.create.validateAsync(req.body);

    const communityWithName = await communityRepo.getCommunityWithName(name);

    if (communityWithName.length > 0) {
      return res.status(409).send("Community Already exists");
    }

    const community = await communityRepo.createCommunity(name, desc, req.uid);

    res.status(201).send({ community });
  }

  static async getCommunities(req, res) {
    console.info("--> GET Community");

    const communities = await communityRepo.getCommunity();

    res.status(200).send({ community: communities });
  }

  static async getCommunity(req, res) {
    console.info("--> GET Community");

    const { id } = req.params;

    const community = await communityRepo.getCommunityWithId(id);

    const profile = await communityRepo.getProfile(id);

    const url = await storage.getUrl(profile.fileName);

    res.status(200).send({ ...community.dataValues, profile: url.publicUrl });
  }

  static async updateCommunity(req, res) {
    console.info("--> Update Community");

    const { id } = req.params;
    const { desc } = req.body;

    await communityValidation.update.validateAsync(req.body);

    if (!(await communityRepo.isCommunityMod(id, req.uid))) {
      throw new UnAuthorizedError();
    }

    await communityRepo.updateCommunity(id, desc);

    res.sendStatus(200);
  }

  static async deleteCommunity(req, res) {
    console.info("--> Delete Community");

    const { id } = req.params;

    if (!(await communityRepo.isCommunityMod(id, req.uid))) {
      throw new UnAuthorizedError();
    }

    await communityRepo.deleteCommunity(id);

    res.sendStatus(200);
  }

  static async communityProfile(req, res) {
    console.info("--> Upload Community Profile pic");

    const { id } = req.params;

    if (!(await communityRepo.isCommunityMod(id, req.uid))) {
      return res.sendStatus(401);
    }

    const profile = await communityRepo.getProfile(id);

    if (profile) {
      storage.deleteFile(profile.dataValues.fileName);
      communityRepo.deleteProfile(id);
    }

    const fileId = v4();
    const fileName = fileId + req.file.originalname;
    await storage.uploadFile(fileName, req.file.buffer);

    await communityRepo.addProfile(fileId, fileName, id);

    res.sendStatus(200);
  }

  static async joinCommunity(req, res) {
    console.info("--> Join Community");

    const { id } = req.params;

    if (!(await communityRepo.getCommunityWithId(id))) {
      throw new NotFoundError();
    }

    if (!(await communityRepo.isCommunityJoined(req.uid, id))) {
      await communityRepo.joinCommunity(req.uid, id);
    }

    res.sendStatus(200);
  }

  static async leaveCommunity(req, res) {
    console.info("--> Leave Community");

    const { id } = req.params;

    if (!(await communityRepo.getCommunityWithId(id))) {
      throw new NotFoundError();
    }

    await communityRepo.leaveCommunity(req.uid, id);

    res.sendStatus(200);
  }
}

module.exports = communityController;
