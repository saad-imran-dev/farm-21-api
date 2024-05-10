class Ranking {
    postScore(likes, time) {
        const alpha = 2
        const beta = 0.85
        const currentTime = new Date().getTime()
        const postTime = new Date(time).getTime()

        return Math.sqrt(1 + likes) / (1 + likes + alpha * Math.log(1 + likes)) /
            (1 + beta * Math.log(1 + (currentTime - postTime)));
    }

    async posts(posts) {
        const scoredPosts = posts.map(post => {
            return {
                ...post,
                score: this.postScore(post.likes, post.createdAt)
            }
        })

        const rankedPosts = scoredPosts.sort((a, b) => b.score - a.score)

        return rankedPosts.map(post => ({ ...post }))
    }

    epochSeconds(date) {
        const epoch = new Date('1970-01-01');
        const td = date - epoch;
        return td / 1000;
    }

    commentScore(votes, date) {
        const s = votes;
        const order = Math.log10(Math.max(Math.abs(s), 1));
        const sign = s > 0 ? 1 : (s < 0 ? -1 : 0);
        const seconds = this.epochSeconds(date) - 1134028003;
        return (sign * order + seconds / 45000).toFixed(7);
    }

    async comments(comments) {
        const scoredComments = comments.map(comment => {
            return {
                ...comment,
                score: this.commentScore(comment.votes, new Date(comment.createdAt))
            }
        })

        const rankedComments = scoredComments.sort((a, b) => b.score - a.score)

        return rankedComments.map(comment => ({ ...comment }))
    }
}

module.exports = Ranking