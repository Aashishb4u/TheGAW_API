const {Resend} = require('resend');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const linkedInEmail = require('../models/linkedInEmail.model'); // Assume you have a model to track sent emails
const fs = require("fs");
const path = require("path");
const axios = require('axios');


const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}


// const triggerEmail = async (userEmail, adminMail, userSubject, emailSubjectAdmin, bodyForAdmin, bodyForUser) => {
//     const resend = new Resend(config.resend_key);
//     const result = await resend.batch.send([
//         {
//             from: 'TheGAW Industries <admin@thegawindustries.com>',
//             to: [userEmail],
//             subject: userSubject,
//             html: bodyForUser.updatedHtmlContent,
//             headers: {
//                 'X-Entity-Ref-ID': config.resend_headers,
//             },
//             tags: [
//                 {
//                     name: 'category',
//                     value: 'confirm_email',
//                 },
//             ],
//         },
//         {
//             from: 'TheGAW Industries <admin@thegawindustries.com>',
//             to: [adminMail],
//             subject: emailSubjectAdmin,
//             html: bodyForAdmin.updatedHtmlContent,
//             headers: {
//                 'X-Entity-Ref-ID': config.resend_headers,
//             },
//             tags: [
//                 {
//                     name: 'category',
//                     value: 'confirm_email',
//                 },
//             ],
//         }
//     ]);

//     console.log(result);

//     return result;
// };



// curl -X POST 'https://api.resend.com/emails' \
//      -H 'Authorization: Bearer re_123456789' \
//      -H 'Content-Type: application/json' \
//      -d $'{
//   "from": "Acme <onboarding@resend.dev>",
//   "to": ["delivered@resend.dev"],
//   "subject": "Receipt for your payment",
//   "html": "<p>Thanks for the payment</p>",
//   "attachments": [
//     {
//       "path": "https://resend.com/static/sample/invoice.pdf",
//       "filename": "invoice.pdf"
//     }
//   ]
// }'


const triggerEmail = async (userEmail, adminMail, userSubject, emailSubjectAdmin, bodyForAdmin, bodyForUser) => {
    try {
        const apiUrl = "https://api.resend.com/emails";
        const headers = {
            Authorization: `Bearer ${config.resend_key}`,
            "Content-Type": "application/json",
        };

        const emailToUser = axios.post(apiUrl, {
            from: "TheGAW Industries <admin@thegawindustries.com>",
            to: [userEmail],
            subject: userSubject,
            html: bodyForUser.updatedHtmlContent,
            attachments: [
                {
                    path: "https://resend.com/static/sample/invoice.pdf",
                    filename: "invoice.pdf",
                },
            ],
        }, { headers });

        const emailToAdmin = axios.post(apiUrl, {
            from: "TheGAW Industries <admin@thegawindustries.com>",
            to: [adminMail],
            subject: emailSubjectAdmin,
            html: bodyForAdmin.updatedHtmlContent,
            attachments: [
                {
                    path: "https://resend.com/static/sample/invoice.pdf",
                    filename: "invoice.pdf",
                },
            ],
        }, { headers });

        // Send both requests in parallel
        const [responseUser, responseAdmin] = await Promise.all([emailToUser, emailToAdmin]);

        console.log("User Email Sent:", responseUser.data);
        console.log("Admin Email Sent:", responseAdmin.data);

        return { userEmail: responseUser.data, adminEmail: responseAdmin.data };
    } catch (error) {
        console.error("Error sending email:", error.response?.data || error.message);
        throw error;
    }
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

module.exports = {
    triggerEmail,
    triggerEmailForCareers,
    triggerProductEmail,
};
