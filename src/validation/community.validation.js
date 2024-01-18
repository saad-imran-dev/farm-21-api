const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().required(),
  desc: Joi.string().required(),
});

const update = Joi.object({
  desc: Joi.string().required(),
});

const communityValidation = {
  create,
  update,
};

module.exports = communityValidation;
