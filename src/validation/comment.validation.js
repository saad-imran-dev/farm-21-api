const Joi = require("joi")

create = Joi.object({
    comment: Joi.string().required(),
})

createReply = Joi.object({
    reply: Joi.string().required(),
})

vote = Joi.object({
    vote: Joi.boolean().required(),
})

commentValidation = {
    create,
    createReply,
    vote
}

module.exports = commentValidation