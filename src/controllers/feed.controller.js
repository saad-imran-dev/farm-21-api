const feedRepo = require("../data/feed.repo")
const postRepo = require("../data/post.repo")

class FeedController {
    async get(req, res) {
        console.log("--> GET Feed")

        const userCommunityPosts = await feedRepo.get(req.uid)
        let feed = []

        userCommunityPosts.joined_communites.forEach(community => {
            feed.push(...community.community_posts)
        })

        feed = await Promise.all(feed.map(async post => {
            const info = await postRepo.getInfo(post.id)
            return { ...post.dataValues, ...info }
        }))

        feed.sort((a, b) => b.likes - a.likes)

        feed = feed.map(post => { return { id: post.id } })

        res.send(feed)
    }
}

const feedController = new FeedController()

module.exports = feedController
