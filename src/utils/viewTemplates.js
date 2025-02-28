const fs = require('fs');
const path = require('path');

const constants = require('../utils/constants');


const fetchAdminTemplate = (userDetails) => {
    let filePath = null;
    let replaceArray = [];
    switch(userDetails.mailType) {
        case 'career':
            replaceArray = ["firstName", "lastName", "email", "phoneNumber", "nationality", "countryName", "jobRole"];
            filePath = path.join(__dirname, '..', 'public', 'templates', 'careers_admin.html');
            break;
        case 'contact':
            replaceArray = ["firstName", "lastName", "email", "phoneNumber", "companyName", "subject", "message"];
            filePath = path.join(__dirname, '..', 'public', 'templates', 'contact_admin.html');
            break;
        case 'product_order_form':
            replaceArray = ["productName"];
            filePath = path.join(__dirname, '..', 'public', 'templates', 'product_admin.html');
            break;
        case 'news_letter':
            replaceArray = ["email"];
            filePath = path.join(__dirname, '..', 'public', 'templates', 'news_letter_admin.html');
            break;
        case 'demo_form':
            replaceArray = ["firstName", "lastName", "email", "phoneNumber", "jobRole", "companyName", "message", "interestedIn", "countryName"];
            filePath = path.join(__dirname, '..', 'public', 'templates', 'demo_form_admin.html');
            break;
        case 'request_for_training':
            replaceArray = ["fullName", "companyName", "jobRole", "email", "phoneNumber", "regionName", "countryName", "interestedIn", "participants", "trainingFormat", "comments"];
            filePath = path.join(__dirname, '..', 'public', 'templates', 'request_for_training.html');
            break;  
        case 'sme_form':
            replaceArray = ["fullName", "email", "phoneNumber", "linkedIn", "experience", "regionName", "countryName", "expertise", "availability", "comments"];
            filePath = path.join(__dirname, '..', 'public', 'templates', 'sme_admin.html');
            break;   
        case 'transfer_partner_form':
            replaceArray = ["companyName", "fullName", "jobRole", "email", "phoneNumber", "regionName", "countryName", "interestedIn", "message", "comments", "mailType"];
            filePath = path.join(__dirname, '..', 'public', 'templates', 'transfer_partner_form.html');
            break;
    }

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                let todaysDate = new Date();
                todaysDate = todaysDate.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                });
                updatedHtmlContent = htmlContent.replace('{{todaysDate}}', todaysDate);
                replaceArray.forEach((val) => {
                    console.log(userDetails[val]); // Debugging output
                    updatedHtmlContent = updatedHtmlContent.replace(new RegExp(`{{${val}}}`, "g"), userDetails[val] || 'N/A');
                });
                const data = {
                    updatedHtmlContent: updatedHtmlContent
                };
                console.log(data.updatedHtmlContent);
                return resolve(data);
            }
        });
    });
}

const careerMailToUser = (userDetails) => {
    let filePath = null;
    const {firstName, lastName, jobRole} = userDetails;
    filePath = path.join(__dirname, '..', 'public', 'templates', 'customer_career.html');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                let todaysDate = new Date();
                todaysDate = todaysDate
                    .toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    });
                let updatedHtmlContent = htmlContent.replace('{{firstName}}', firstName);
                updatedHtmlContent = updatedHtmlContent.replace('{{lastName}}', lastName);
                updatedHtmlContent = updatedHtmlContent.replace('{{jobRole}}', jobRole);
                updatedHtmlContent = updatedHtmlContent.replace('{{todaysDate}}', todaysDate);
                const data = {
                    updatedHtmlContent: updatedHtmlContent
                };
                return resolve(data);
            }
        });
    });
}

const demoMailToUser = (userDetails) => {
    let filePath = null;
    const {firstName, lastName, jobRole} = userDetails;
    filePath = path.join(__dirname, '..', 'public', 'templates', 'customer_career.html');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                let todaysDate = new Date();
                todaysDate = todaysDate
                    .toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    });
                    
                let updatedHtmlContent = htmlContent.replace('{{firstName}}', firstName);
                updatedHtmlContent = updatedHtmlContent.replace('{{lastName}}', lastName);
                updatedHtmlContent = updatedHtmlContent.replace('{{jobRole}}', jobRole);
                const data = {
                    updatedHtmlContent: updatedHtmlContent
                };
                return resolve(data);
            }
        });
    });
}

const contactMailToUser = (userDetails) => {
    let filePath = null;
    filePath = path.join(__dirname, '..', 'public', 'templates', 'customer_contact.html');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                let todaysDate = new Date();
                todaysDate = todaysDate
                    .toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    });
                const data = {
                    updatedHtmlContent: htmlContent.replace('{{todaysDate}}', todaysDate)
                };
                return resolve(data);
            }
        });
    });
}

const fetchLinkedInMailToUserTemplate = () => {
    let filePath = null;
    filePath = path.join(__dirname, '..', 'public', 'templates', 'linkedIn_mail_template_seo_optimised.html');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                const data = {
                    updatedHtmlContent: htmlContent
                };
                return resolve(data);
            }
        });
    });
}

module.exports = {
    fetchAdminTemplate,
    careerMailToUser,
    contactMailToUser,
    fetchLinkedInMailToUserTemplate,
    demoMailToUser
};
