const Joi = require("joi");

const post = Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().required(),
    communityId: Joi.string().required()
})

const postValidation = {
    post
}

module.exports = postValidation