const { ValidationError } = require("joi");
const communityRepo = require("../data/community.repo");
const communityValidation = require("../validation/community.validation");
const storage = require("../supabase/Storage");
const { v4 } = require("uuid")

class communityController {
  static async createCommunity(req, res) {
    console.info("--> Create Community");

    try {
      const { name, desc } = req.body;

      await communityValidation.create.validateAsync(req.body);

      const communityWithName = await communityRepo.getCommunityWithName(name);

      if (communityWithName.length > 0) {
        return res.status(409).send("Community Already exists");
      }

      const community = await communityRepo.createCommunity(name, desc, req.uid);

      res.status(201).send({ community });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).send("Invalid inputs");
      } else {
        res.sendStatus(500);
      }
      console.error(`Error: ${error.message}`);
    }
  }

  static async getCommunities(req, res) {
    console.info("--> GET Community");

    try {
      const communities = await communityRepo.getCommunity();

      res.status(200).send({ community: communities });
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }

  static async getCommunity(req, res) {
    console.info("--> GET Community");

    try {
      const { id } = req.params

      const community = await communityRepo.getCommunityWithId(id);

      const profile = await communityRepo.getProfile(id)

      const url = await (await storage.getUrl(profile.fileName))

      res.status(200).send({ ...community.dataValues, profile: url.publicUrl });
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }

  static async updateCommunity(req, res) {
    console.info("--> Update Community");

    try {
      const { id } = req.params;
      const { desc } = req.body;

      await communityValidation.update.validateAsync(req.body);

      if (!(await communityRepo.isCommunityMod(id, req.uid))) {
        return res.sendStatus(401);
      }

      await communityRepo.updateCommunity(id, desc);

      res.sendStatus(200);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).send("Invalid inputs");
      } else {
        res.sendStatus(500);
      }
      console.error(`Error: ${error.message}`);
    }
  }

  static async deleteCommunity(req, res) {
    console.info("--> Delete Community");

    try {
      const { id } = req.params;

      if (!(await communityRepo.isCommunityMod(id, req.uid))) {
        return res.sendStatus(401);
      }

      await communityRepo.deleteCommunity(id);

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }

  static async communityProfile(req, res) {
    console.info("--> Upload Community Profile pic");

    try {
      const { id } = req.params;

      if (!(await communityRepo.isCommunityMod(id, req.uid))) {
        return res.sendStatus(401);
      }

      const profile = await communityRepo.getProfile(id)
      
      if(profile){
        storage.deleteFile(profile.dataValues.fileName)
        communityRepo.deleteProfile(id)
      }

      const fileId = v4()
      const fileName = fileId + req.file.originalname
      await storage.uploadFile(fileName, req.file.buffer);

      await communityRepo.addProfile(fileId, fileName, id)

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
      console.log(error);
    }
  }

  static async joinCommunity(req, res) {
    console.info("--> Join Community");

    try {
      const { id } = req.params;

      if (!(await communityRepo.getCommunityWithId(id))) {
        return res.status(404).send("Community Not Found");
      }

      if (!(await communityRepo.isCommunityJoined(req.uid, id))) {
        await communityRepo.joinCommunity(req.uid, id);
      }

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
      console.log(error);
    }
  }

  static async leaveCommunity(req, res) {
    console.info("--> Leave Community");

    try {
      const { id } = req.params;

      if (!(await communityRepo.getCommunityWithId(id))) {
        return res.status(404).send("Community Not Found");
      }

      await communityRepo.leaveCommunity(req.uid, id);

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }
}

module.exports = communityController;
