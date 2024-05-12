class Ranking {
    postScore(likes, time) {
        const alpha = 2
        const beta = 0.85
        const currentTime = new Date().getTime()
        const postTime = new Date(time).getTime()

        return Math.sqrt(1 + likes) / (1 + likes + alpha * Math.log(1 + likes)) /
            (1 + beta * Math.log(1 + currentTime - postTime));
    }

    async posts(posts) {
        const scoredPosts = posts.map(post => {
            return {
                ...post,
                score: this.postScore(post.likes, post.createdAt)
            }
        })

        return scoredPosts.sort((a, b) => b.score - a.score)
    }

    commentScore(votes, date) {
        const postDate = new Date(date).getTime()
        const order = Math.log10(Math.max(Math.abs(votes), 1));
        const sign = votes > 0 ? 1 : (votes < 0 ? -1 : 0);
        const seconds = (postDate / 1000) - 1134028003;
        return (sign * order + seconds / 45000).toFixed(7);
    }

    async comments(comments) {
        const scoredComments = comments.map(comment => {
            return {
                ...comment,
                score: this.commentScore(comment.votes, comment.createdAt)
            }
        })

        return scoredComments.sort((a, b) => b.score - a.score)
    }
}

module.exports = Ranking