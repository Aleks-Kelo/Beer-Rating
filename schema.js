const Joi = require('joi');

//beer schema
const beerSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).optional(),
});

//rating schema
const ratingSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5),
});

module.exports = {
    beerSchema,
    ratingSchema,
};
