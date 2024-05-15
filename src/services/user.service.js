const userRepo = require('../data/user.repo')
const NlpService = require('./nlp.service')
const TestamonialService = require('./testamonial.service')

class UserService {
    constructor() {
        this.repo = userRepo
        this.testamonialService = new TestamonialService()
        this.nlpService = new NlpService()
    }

    async isExpert(userId) {
        const testimonials = await this.testamonialService.get(userId)
        // console.log("Not Enough Testimonials")
        if (testimonials.length < 0.05 * (await userRepo.numUsers())) return false
        let polarity = 0
        testimonials.forEach(t => {
            this.nlpService.getSentiment(t.testamonial) > 0
                ? polarity = polarity + 1
                : polarity = polarity - 1
        })
        console.log("polarity:", polarity)
        return polarity > 0 ? true : false;
    }
}

module.exports = UserService