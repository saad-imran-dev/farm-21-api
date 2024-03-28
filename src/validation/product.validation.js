const Joi = require('joi')

const create = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
})

const update = create

const productValidation = {
    create,
    update
}

module.exports = productValidation