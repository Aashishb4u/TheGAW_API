const {Resend} = require('resend');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const linkedInEmail = require('../models/linkedInEmail.model'); // Assume you have a model to track sent emails
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const basePath = 'https://thegawindustries.com/attachments';

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

// We are using SDK here
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
        const apiUrl = `${config.resend_url}`;
        const headers = {
            Authorization: `Bearer ${config.resend_key}`,
            "Content-Type": "application/json",
        };

        const emailToUser = axios.post(apiUrl, {
            from: "TheGAW Industries <admin@thegawindustries.com>",
            to: [userEmail],
            subject: userSubject,
            html: bodyForUser.updatedHtmlContent,
        }, { headers });

        const emailToAdmin = axios.post(apiUrl, {
            from: "TheGAW Industries <admin@thegawindustries.com>",
            to: [adminMail],
            subject: emailSubjectAdmin,
            html: bodyForAdmin.updatedHtmlContent,
        }, { headers });

        // Send both requests in parallel
        const [responseUser, responseAdmin] = await Promise.all([emailToUser, emailToAdmin]);
        return { userEmail: responseUser.data, adminEmail: responseAdmin.data };
    } catch (error) {
        console.error("Error sending email:", error.response?.data || error.message);
        throw error;
    }
};





// const triggerEmailForCareers = async (userEmail, adminMail, userSubject, emailSubjectAdmin, bodyForAdmin, bodyForUser, uploadedFiles) => {
//     const resend = new Resend(config.resend_key);

//     // Read file contents from disk
//     const attachments = uploadedFiles.map((file) => ({
//         filename: file.originalname, 
//         content: fs.readFileSync(file.path), // Read file content
//     }));

//     let adminMailResult = await resend.emails.send(
//         {
//             from: 'TheGAW Industries <admin@thegawindustries.com>',
//             to: [adminMail],
//             subject: emailSubjectAdmin,
//             html: bodyForAdmin.updatedHtmlContent,
//             headers: {
//                 'X-Entity-Ref-ID': config.resend_headers,
//             },
//             tags: [
//                 { name: 'category', value: 'confirm_email' },
//             ],
//             attachments, // Attach files for admin email
//         });


//     adminMailResult = await resend.emails.send(
//             {
//                 from: 'TheGAW Industries <admin@thegawindustries.com>',
//                 to: [userEmail],
//                 subject: userSubject,
//                 html: bodyForUser.updatedHtmlContent,
//                 headers: {
//                     'X-Entity-Ref-ID': config.resend_headers,
//                 },
//                 tags: [
//                     { name: 'category', value: 'confirm_email' },
//                 ],
//             }
//           );

//     console.log(adminMailResult);
//     return adminMailResult;
// };


const triggerEmailForCareers = async (userEmail, adminMail, userSubject, emailSubjectAdmin, bodyForAdmin, bodyForUser, uploadedFiles) => {

    const attachments = uploadedFiles.map((file) => ({
        path: `${config.base_path}/${file.filename}`,
        filename: file.originalname, 
    }));

    console.log(attachments);


    const apiUrl = `${config.resend_url}`;
    console.log(apiUrl);
    const headers = {
        Authorization: `Bearer ${config.resend_key}`,
        "Content-Type": "application/json",
    };

    const emailToUser = axios.post(apiUrl, {
        from: "TheGAW Industries <admin@thegawindustries.com>",
        to: [userEmail],
        subject: userSubject,
        html: bodyForUser.updatedHtmlContent,
    }, { headers });

    const emailToAdmin = axios.post(apiUrl, {
        from: "TheGAW Industries <admin@thegawindustries.com>",
        to: [adminMail],
        subject: emailSubjectAdmin,
        html: bodyForAdmin.updatedHtmlContent,
        attachments: attachments
    }, { headers });

    const [responseUser, responseAdmin] = await Promise.all([emailToUser, emailToAdmin]);

    // Send both requests in parallel
    return { userEmail: responseUser.data, adminEmail: responseAdmin.data };

};


// const triggerProductEmail = async ( adminMail, emailSubjectAdmin, bodyForAdmin, uploadedFiles) => {
//     const resend = new Resend(config.resend_key);

//     // Read file contents from disk
//     const attachments = uploadedFiles.map((file) => ({
//         filename: file.originalname, 
//         content: fs.readFileSync(file.path), // Read file content
//     }));

//     let adminMailResult = await resend.emails.send(
//         {
//             from: 'TheGAW Industries <admin@thegawindustries.com>',
//             to: [adminMail],
//             subject: emailSubjectAdmin,
//             html: bodyForAdmin.updatedHtmlContent,
//             headers: {
//                 'X-Entity-Ref-ID': config.resend_headers,
//             },
//             tags: [
//                 { name: 'category', value: 'confirm_email' },
//             ],
//             attachments, // Attach files for admin email
//         });

//     console.log(adminMailResult);
//     return adminMailResult;
// };


const triggerProductEmail = async (adminMail, emailSubjectAdmin, bodyForAdmin, uploadedFiles) => {
    try {
        // Ensure uploadedFiles is an array
        const attachments = Array.isArray(uploadedFiles) ? uploadedFiles.map((file) => ({
            path: `${config.base_path}/${file.filename}`,
            filename: file.originalname,
        })) : [];

        const apiUrl = `${config.resend_url}`;
        const headers = {
            Authorization: `Bearer ${config.resend_key}`,
            "Content-Type": "application/json",
        };

        // Ensure bodyForAdmin is valid
        if (!bodyForAdmin || typeof bodyForAdmin.updatedHtmlContent !== "string") {
            throw new Error("Invalid email body content.");
        }

        // Send email request
        const emailToAdmin = await axios.post(apiUrl, {
            from: "TheGAW Industries <admin@thegawindustries.com>",
            to: [adminMail],
            subject: emailSubjectAdmin,
            html: bodyForAdmin.updatedHtmlContent,
            attachments: attachments.length > 0 ? attachments : undefined,  // Only add if not empty
        }, { headers });

        return emailToAdmin;
    } catch (error) {
        console.error("Error sending email:", error?.response?.data || error.message);
        throw error; // Rethrow the error for further handling
    }
};


module.exports = {
    triggerEmail,
    triggerEmailForCareers,
    triggerProductEmail,
};
