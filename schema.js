const Joi = require('joi');
const Listening = require('./models/listening');
// const expErr = require('./utils/expErr');

const listingSchema =Joi.object({
    Listings:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow("",null),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required()
    })

})
module.exports=listingSchema;

const reviewSchema=Joi.object({
    Listening:Joi.object({
        rating:Joi.number().required(),
        Comment:Joi.string().required()
    }).required()
})

module.exports=reviewSchema;