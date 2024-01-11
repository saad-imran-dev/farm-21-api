const Joi = require("joi");

const signup = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/).required()
})

const verifyOTP = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    token: Joi.string().pattern(/^\d{6}$/).required(),
})

const userValidation = {
    signup,
    verifyOTP,
}

module.exports = userValidation