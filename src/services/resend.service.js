const {Resend} = require('resend');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const linkedInEmail = require('../models/linkedInEmail.model'); // Assume you have a model to track sent emails
const fs = require("fs");
const path = require("path");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}


const triggerEmail = async (userEmail, adminMail, userSubject, emailSubjectAdmin, bodyForAdmin, bodyForUser) => {
    const resend = new Resend(config.resend_key);
    const result = await resend.batch.send([
        {
            from: 'TheGAW Industries <admin@thegawindustries.com>',
            to: [userEmail],
            subject: userSubject,
            html: bodyForUser.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        },
        {
            from: 'TheGAW Industries <admin@thegawindustries.com>',
            to: [adminMail],
            subject: emailSubjectAdmin,
            html: bodyForAdmin.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        }
    ]);

    console.log(result);

    return result;
};


const triggerEmailForCareers = async (userEmail, adminMail, userSubject, emailSubjectAdmin, bodyForAdmin, bodyForUser, uploadedFiles) => {
    const resend = new Resend(config.resend_key);

    // Read file contents from disk
    const attachments = uploadedFiles.map((file) => ({
        filename: file.originalname, 
        content: fs.readFileSync(file.path), // Read file content
    }));

    let adminMailResult = await resend.emails.send(
        {
            from: 'TheGAW Industries <admin@thegawindustries.com>',
            to: [adminMail],
            subject: emailSubjectAdmin,
            html: bodyForAdmin.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                { name: 'category', value: 'confirm_email' },
            ],
            attachments, // Attach files for admin email
        });


    adminMailResult = await resend.emails.send(
            {
                from: 'TheGAW Industries <admin@thegawindustries.com>',
                to: [userEmail],
                subject: userSubject,
                html: bodyForUser.updatedHtmlContent,
                headers: {
                    'X-Entity-Ref-ID': config.resend_headers,
                },
                tags: [
                    { name: 'category', value: 'confirm_email' },
                ],
            }
          );

    console.log(adminMailResult);
    return adminMailResult;
};


const triggerProductEmail = async ( adminMail, emailSubjectAdmin, bodyForAdmin, uploadedFiles) => {
    const resend = new Resend(config.resend_key);

    // Read file contents from disk
    const attachments = uploadedFiles.map((file) => ({
        filename: file.originalname, 
        content: fs.readFileSync(file.path), // Read file content
    }));

    let adminMailResult = await resend.emails.send(
        {
            from: 'TheGAW Industries <admin@thegawindustries.com>',
            to: [adminMail],
            subject: emailSubjectAdmin,
            html: bodyForAdmin.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                { name: 'category', value: 'confirm_email' },
            ],
            attachments, // Attach files for admin email
        });

    console.log(adminMailResult);
    return adminMailResult;
};


const sendLinkedInEmail = async (userEmail, bodyForUser) => {
    const resend = new Resend(config.resend_key);

    // Sending the email using the Resend API
    const result = await resend.batch.send([
        {
            from: 'TheGAW Industries <admin@thegawindustries.com>',
            to: [userEmail],
            subject: 'Potential Fit for Your Team – Aashish Bhagwat’s Portfolio',
            html: bodyForUser.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        }
    ]);

    // Check if the email already exists in the database
    const existingEmail = await linkedInEmail.findOne({ email: userEmail });

    // If the email does not exist, save it to the database
    if (!existingEmail) {
        await new linkedInEmail({ email: userEmail }).save();
        console.log(`Saved email: ${userEmail}`);
    }

    // Return the result of the Resend API call
    return result;
};


module.exports = {
    triggerEmail,
    sendLinkedInEmail,
    triggerEmailForCareers,
    triggerProductEmail,
};
