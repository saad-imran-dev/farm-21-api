const Joi = require("joi")

createComment = Joi.object({
    comment: Joi.string().required(),
})

createReply = Joi.object({
    reply: Joi.string().required(),
})

commentValidation = {
    createComment,
    createReply,
}

module.exports = commentValidation