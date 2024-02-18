class CommentController {
    async get(req, res) {
        res.send("OK")
    }

    async getReply(req, res) {
        res.send("OK")
    }

    async create(req, res) {
        res.send("OK")
    }

    async createReply(req, res) {
        res.send("OK")
    }

    async delete(req, res) {
        res.send("OK")
    }

    async deleteReply(req, res) {
        res.send("OK")
    }
}

const commentController = new CommentController()

module.exports = commentController;