const { ValidationError } = require("joi");
const postRepo = require("../data/post.repo");
const userRepo = require("../data/user.repo");
const postValidation = require("../validation/post.validation");
const storage = require("../utils/Storage");
const database = require("../data/Database");
const communityRepo = require("../data/community.repo");
const NotFoundError = require("../Exceptions/NotFoundError");

class postController {
  static async createPost(req, res) {
    console.info("--> Create Post");

    const transaction = await database.getTransaction();

    try {
      const { title, content, communityId } = req.body;

      await postValidation.post.validateAsync(req.body);

      const post = await postRepo.createPost(
        title,
        content,
        req.uid,
        communityId,
        transaction
      );

      await Promise.all(
        req.files.map(async (file) => {
          const fileName = post.id + "/" + Date.now() + "-" + file.originalname;
          await storage.uploadFile(fileName, file.buffer);
          await postRepo.createAttachment(fileName, post.id, transaction);
        })
      );

      await transaction.commit();
      res.sendStatus(201);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      await transaction.rollback();

      if (error instanceof ValidationError) {
        res.status(400).send("Invalid inputs");
      } else {
        res.sendStatus(500);
      }
    }
  }

  static async getPosts(req, res) {
    console.info("--> GET User Posts");

    try {
      const posts = await postRepo.getPosts(req.uid);

      res.status(200).send(posts);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }

  static async getUserPost(req, res) {
    const { id } = req.params;

    const user = await userRepo.get(id);
    if (!user) throw new NotFoundError();
    
    const posts = await postRepo.getPosts(user.dataValues.id);

    res.status(200).send(posts);
  }

  static async getPost(req, res) {
    console.info("--> GET a Post");

    try {
      const { id } = req.params;

      const post = await postRepo.getPost(id);
      
      if (!post) {
        return res.sendStatus(404);
      }

      const attachments = await postRepo.getAttachments(id);
      
      const url = await Promise.all(
        attachments.map(async (attachment) => {   
          const fileUrl = await storage.getUrl(attachment.dataValues.fileName);
          return fileUrl?.publicUrl;
        })
      );

      const communityProfile = await communityRepo.getProfile(
        post.dataValues.community_posts.dataValues.id
      );

      const info = await postRepo.getInfo(id);

      let communityProfileUrl = await storage.getUrl(
        communityProfile?.fileName
      );

      if (
        communityProfileUrl.publicUrl.split("/").slice(-1)[0] === "undefined"
      ) {
        communityProfileUrl = undefined;
      } else {
        communityProfileUrl = communityProfile.publicUrl
      }

      res.status(200).send({
        ...info,
        ...post.dataValues,
        community_posts: {
          ...post.dataValues.community_posts.dataValues,
          profile: communityProfileUrl,
        },
        attachments: url,
      });
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }

  static async deletePost(req, res) {
    console.info("--> DELETE Post");
    const transaction = await database.getTransaction();

    try {
      const { id } = req.params;

      const post = await postRepo.getPost(id);

      if (!post) {
        return res.sendStatus(404);
      }

      if (post?.user_posts?.id !== req.uid) {
        return res.sendStatus(401);
      }

      const attachments = await postRepo.getAttachments(id);

      if (attachments.length > 0) {
        await Promise.all(
          attachments.map(async (attachment) => {
            await storage.deleteFile(attachment.fileName);
          })
        );
      }

      await postRepo.deleteAttachments(id, transaction);

      await postRepo.deletePost(id, transaction);

      await transaction.commit();

      res.sendStatus(200);
    } catch (error) {
      await transaction.rollback();
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }

  static async likePost(req, res) {
    console.info("--> Like a Post");

    try {
      const { id } = req.params;

      const post = await postRepo.getPost(id);

      if (!post) {
        return res.sendStatus(404);
      }

      if (!(await postRepo.isPostLiked(id, req.uid))) {
        await postRepo.likePost(id, req.uid);
      }

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }

  static async dislikePost(req, res) {
    console.info("--> Dislike a Post");

    try {
      const { id } = req.params;

      const post = await postRepo.getPost(id);

      if (!post) {
        return res.sendStatus(404);
      }

      await postRepo.dislikePost(id, req.uid);

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.error(`Error: ${error.message}`);
    }
  }
}

module.exports = postController;
