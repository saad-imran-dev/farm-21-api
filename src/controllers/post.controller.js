const { ValidationError } = require("joi");
const postRepo = require("../data/post.repo");
const postValidation = require("../validation/post.validation");
const storage = require("../supabase/Storage");
const { v4 } = require("uuid");
const database = require("../data/Database");

class postController {
    static async createPost(req, res) {
        console.info("--> Create Post");

        try {
            const { title, content, communityId } = req.body;

            await postValidation.post.validateAsync(req.body)

            await postRepo.createPost(title, content, req.uid, communityId)

            res.sendStatus(201);
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send("Invalid inputs");
            } else {
                res.sendStatus(500);
            }
            console.error(`Error: ${error.message}`);
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

    static async getPost(req, res) {
        console.info("--> GET a Post");

        try {
            const { id } = req.params

            const post = await postRepo.getPost(id);

            if (!post) {
                return res.sendStatus(404)
            }

            const info = await postRepo.getInfo(id);

            res.status(200).send({ ...post.dataValues, ...info });
        } catch (error) {
            res.sendStatus(500);
            console.error(`Error: ${error.message}`);
        }
    }

    static async deletePost(req, res) {
        console.info("--> DELETE Post");

        try {
            const { id } = req.params
            const transaction = database.getTransaction()

            const post = await postRepo.getPost(id)

            if (!post) {
                return res.sendStatus(404)
            }

            if (post?.user_posts?.id !== req.uid) {
                return res.sendStatus(401)
            }

            const attachments = await postRepo.getAttachments(id)

            if (attachments.length > 0) {
                await Promise.all(attachments.forEach(async attachment => {
                    await storage.deleteFile(attachment.fileName)
                }));
            }

            await postRepo.deleteAttachments(id)

            await postRepo.deletePost(id)

            await transaction.commit()

            res.sendStatus(200);
        } catch (error) {
            await transaction.rollback()
            res.sendStatus(500);
            console.error(`Error: ${error.message}`);
        }
    }

    static async likePost(req, res) {
        console.info("--> Like a Post");

        try {
            const { id } = req.params

            const post = await postRepo.getPost(id);

            if (!post) {
                return res.sendStatus(404)
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
            const { id } = req.params

            const post = await postRepo.getPost(id);

            if (!post) {
                return res.sendStatus(404)
            }

            await postRepo.dislikePost(id, req.uid)

            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
            console.error(`Error: ${error.message}`);
        }
    }
}

module.exports = postController;
