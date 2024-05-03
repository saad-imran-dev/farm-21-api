const fs = require("fs");
const sequelize = require("../config/sequelize");

class Database {
  constructor() {
    if (!Database.instance) {
      this.db = {};
      this.loadModels();
      this.addRelations();
      Database.instance = this;
    }

    return Database.instance;
  }

  loadModels() {
    let files = fs.readdirSync("./src/models");
    files.forEach((file) => {
      let model = require(`../models/${file}`);
      this.db[model.name] = model;
    });
  }

  addRelations() {
    // Message sender relation
    this.db.users.hasMany(this.db.messages, {
      as: "sender",
      foreignKey: "senderId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Message receiver relation
    this.db.users.hasMany(this.db.messages, {
      as: "receiver",
      foreignKey: "receiverId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // User Posts relation
    this.db.users.hasMany(this.db.posts, {
      as: "user_posts",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // User Attachment relation
    this.db.users.hasMany(this.db.attachments, {
      as: "user_attachments",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // User Community Moderator relation
    this.db.users.hasMany(this.db.communities, {
      as: "community_moderator",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Community Posts relation
    this.db.communities.hasMany(this.db.posts, {
      as: "community_posts",
      foreignKey: "communityId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Community Attachment relation
    this.db.communities.hasMany(this.db.attachments, {
      as: "community_attachments",
      foreignKey: "communityId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // User Community Moderator relation
    this.db.communities.belongsTo(this.db.users, { as: "community_moderator", foreignKey: "userId", });

    // Post Attachments relation
    this.db.posts.hasMany(this.db.attachments, {
      as: "post_attachments",
      foreignKey: "postId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Post Comments relation
    this.db.posts.hasMany(this.db.comments, {
      as: "post_comments",
      foreignKey: "postId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Post community relation
    this.db.posts.belongsTo(this.db.communities, { as: "community_posts", foreignKey: "communityId", });

    // Post User relation
    this.db.posts.belongsTo(this.db.users, { as: "user_posts", foreignKey: "userId", });

    // User Comments relation
    this.db.users.hasMany(this.db.comments, {
      as: "user_comments",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // User Orders relation
    this.db.users.hasMany(this.db.orders, {
      as: "user_orders",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // User Products relation
    this.db.users.hasMany(this.db.products, {
      as: "user_products",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Post Attachments relation
    this.db.products.hasMany(this.db.attachments, {
      as: "product_attachments",
      foreignKey: "productId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Products User relation
    this.db.products.belongsTo(this.db.users, { as: "user_products", foreignKey: "userId", });

    // Comment and Reply relations
    this.db.comments.hasMany(this.db.comments, {
      as: "comment_replies",
      foreignKey: "commentId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Comments User relation
    this.db.comments.belongsTo(this.db.users, { as: "user_comments", foreignKey: "userId", });

    // Post Comments relation
    this.db.comments.belongsTo(this.db.posts, { as: "post_comments", foreignKey: "postId", });

    // likes M:N relation btw users & posts
    this.db.users.belongsToMany(this.db.posts, {
      as: "likes",
      through: this.db.post_liked_by_user,
    });
    this.db.posts.belongsToMany(this.db.users, {
      as: "likes",
      through: this.db.post_liked_by_user,
    });

    // joined communities M:N relation btw users & communities
    this.db.users.belongsToMany(this.db.communities, {
      as: "joined_communites",
      through: this.db.user_joined_communities,
    });
    this.db.communities.belongsToMany(this.db.users, {
      as: "joined_communites",
      through: this.db.user_joined_communities,
    });

    // comment votes M:N relation btw comments & users
    this.db.users.belongsToMany(this.db.comments, {
      as: "comment_votes",
      through: this.db.comment_votes_by_user,
    });
    this.db.comments.belongsToMany(this.db.users, {
      as: "comment_votes",
      through: this.db.comment_votes_by_user,
    });

    // Products in Orders M:N relation btw products & orders
    this.db.products.belongsToMany(this.db.orders, {
      as: "orders",
      through: this.db.products_in_order,
    });
    this.db.orders.belongsToMany(this.db.products, {
      as: "orders",
      through: this.db.products_in_order,
    });
  }

  getDatabase() {
    return this.db;
  }

  async getTransaction() {
    return await sequelize.transaction();
  }

  async sync() {
    if (process.env.NODE_ENV !== "production") {
      console.log(`--> Syncing database...`);
      await sequelize.sync();
      console.log(`--> Database and Models synced`);
    }
  }
}

const database = new Database();

module.exports = database;
