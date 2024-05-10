const database = require("./database");

class PostRepo {
  constructor() {
    this.db = database.getDatabase();
  }

  async createPost(title, content, userId, communityId, transaction) {
    const post = await this.db.posts.create(
      {
        title,
        content,
        userId,
        communityId,
      },
      { transaction }
    );

    return post;
  }

  async getPosts(userId) {
    const posts = await this.db.posts.findAll({
      where: {
        userId: userId,
      },
      attributes: ["id"],
    });

    return posts;
  }

  async getPost(id) {
    const post = await this.db.posts.findOne({
      where: {
        id: id,
      },
      include: [
        {
          association: "community_posts",
          attributes: ["id", "name", "desc"],
        },
        {
          association: "user_posts",
          attributes: ["id", "name"],
        },
      ],
      attributes: ["id", "title", "content", "createdAt"],
    });

    return post;
  }

  async getInfo(id) {
    const likes = await this.db.post_liked_by_user.count({
      where: {
        postId: id,
      },
    });

    const comments = await this.db.comments.count({
      where: {
        postId: id,
      },
    });

    return { likes, comments };
  }

  async deletePost(id, transaction = null) {
    await this.db.posts.destroy(
      {
        where: {
          id,
        },
      },
      { transaction }
    );
  }

  async createAttachment(fileName, postId, transaction = null) {
    const attachment = await this.db.attachments.create(
      {
        fileName,
        postId,
      },
      { transaction }
    );

    return attachment;
  }

  async getAttachments(postId) {
    const attachments = await this.db.attachments.findAll({
      where: {
        postId: postId,
      },
    });

    return attachments;
  }

  async deleteAttachments(postId, transaction = null) {
    await this.db.attachments.destroy(
      {
        where: {
          postId,
        },
      },
      { transaction }
    );
  }

  async likePost(postId, userId) {
    await this.db.post_liked_by_user.create({
      postId,
      userId,
    });
  }

  async dislikePost(postId, userId, transaction = null) {
    await this.db.post_liked_by_user.destroy(
      {
        where: {
          postId,
          userId,
        },
      },
      { transaction }
    );
  }

  async isPostLiked(postId, userId) {
    const post = await this.db.post_liked_by_user.findOne({
      where: {
        postId,
        userId,
      },
    });

    if (post) {
      return true;
    } else {
      return false;
    }
  }
}

const postRepo = new PostRepo();

module.exports = postRepo;
