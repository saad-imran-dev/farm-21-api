const Joi = require('joi')

const create = Joi.object({
    testamonial: Joi.string().required(),
})

const testamonialValidation = {
    create
}

module.exports = testamonialValidation