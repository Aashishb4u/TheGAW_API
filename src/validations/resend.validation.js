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


const demo_form = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        jobRole: Joi.string().required(),
        email: Joi.string().required().email(),
        interestedIn: Joi.string().required(),
        companyName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        countryName: Joi.string().required(),
        message: Joi.string().required(),
        mailType: Joi.string().required()
    }),
};

const request_for_training = {
    body: Joi.object().keys({
        fullName: Joi.string().required(),
        companyName: Joi.string().required(),
        jobRole: Joi.string().required(),
        email: Joi.string().required().email(),
        phoneNumber: Joi.string().required(),
        regionName: Joi.string().required(),
        countryName: Joi.string().required(),
        interestedIn: Joi.string().required(),
        participants: Joi.number().required(),
        trainingFormat: Joi.string().required(),
        comments: Joi.string().required(),
        mailType: Joi.string().required()
    }),
};

const sme_form = {
    body: Joi.object().keys({
        fullName: Joi.string().required(),
        email: Joi.string().required().email(),
        phoneNumber: Joi.string().required(),
        linkedIn: Joi.string(),
        experience: Joi.number().required(),
        regionName: Joi.string().required(),
        countryName: Joi.string().required(),
        expertise: Joi.string().required(),
        availability: Joi.string().required(),
        comments: Joi.string().required(),
        mailType: Joi.string().required()
    }),
};

const transfer_partner = {
    body: Joi.object().keys({
        companyName: Joi.string().required(),
        fullName: Joi.string().required(),
        jobRole: Joi.string().required(),
        email: Joi.string().required().email(),
        phoneNumber: Joi.string().required(),
        regionName: Joi.string().required(),
        countryName: Joi.string().required(),
        interestedIn: Joi.array().required(),
        message: Joi.string().required(),
        comments: Joi.string().required(),
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
    news_letter,
    demo_form,
    request_for_training,
    sme_form,
    transfer_partner
};


