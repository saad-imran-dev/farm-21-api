const communityRepo = require("../data/community.repo");
const feedRepo = require("../data/feed.repo")
const postRepo = require("../data/post.repo");
const Ranking = require("../utils/Ranking");
const storage = require("../utils/Storage");

class FeedController {
    constructor() {
        this.ranking = new Ranking()
    }

    getPostDetails = async (id, userId)=> {
        const post = await postRepo.getPost(id);

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
            communityProfileUrl = communityProfileUrl.publicUrl
        }

        return {
            ...info,
            ...post.dataValues,
            community_posts: {
                ...post.dataValues.community_posts.dataValues,
                profile: communityProfileUrl,
            },
            attachments: url,
            isLiked: await postRepo.isPostLiked(id, userId)
        }
    }

    get = async (req, res) =>  {
        console.log("--> GET Feed")

        const userCommunityPosts = await feedRepo.get(req.uid)
        let feed = []

        userCommunityPosts.joined_communites.forEach(community => {
            feed.push(...community.community_posts)
        })

        feed = await Promise.all(
            feed.map(async post => {
                const data = await this.getPostDetails(post.dataValues.id, req.uid)
                return { ...data }
            })
        )

        feed.sort((a, b) => b.likes - a.likes)
        feed = await this.ranking.posts(feed)

        res.send(feed)
    }
}

const feedController = new FeedController()

module.exports = feedController
