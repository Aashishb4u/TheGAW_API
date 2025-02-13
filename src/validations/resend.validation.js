const Joi = require('joi');

const contact_us = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        phoneNumber: Joi.string().required(),
        companyName: Joi.string().required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        mailType: Joi.string().required()

    }),
};

const product_order_form = {
    body: Joi.object().keys({
        productName: Joi.string().required(),
        mailType: Joi.string().required()

    }),
};


const news_letter = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        mailType: Joi.string().required()
    }),
};


const careers = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        phoneNumber: Joi.string().required(),
        nationality: Joi.string().required(),
        countryName: Joi.string().required(),
        jobRole: Joi.string().required(),
        mailType: Joi.string().required()
    }),
};


module.exports = {
    contact_us,
    product_order_form,
    careers,
    news_letter
};


