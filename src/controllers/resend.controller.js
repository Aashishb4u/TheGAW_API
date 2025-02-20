const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { resendService } = require('../services');
const { handleSuccess } = require('../utils/SuccessHandler');
const templateService = require('../utils/viewTemplates');
const fetch = require('node-fetch');
const {Headers} = require('node-fetch');
const constants = require('../utils/constants');

global.fetch = fetch;
global.Headers = Headers;

const sendEmailToCustomer = catchAsync(async (req, res) => {
    const {email } = req.body; // Here we need to upgrade as per multi-parts
    const adminMail = constants.ADMIN_EMAIL;
    const emailSubjectAdmin = constants.ADMIN_SUBJECT;
    const userSubject = `${constants.CUSTOMER_SUBJECT}`;
    const {bodyForAdmin, bodyForUser} = await generateEmail(req.body);
    const verifyEmail = await resendService.triggerEmail(email, adminMail,
    userSubject, emailSubjectAdmin,  bodyForAdmin, bodyForUser);
    handleSuccess(httpStatus.OK, {verifyEmail}, 'Email Sent Successfully.', req, res);
});

const sendProductEmail = catchAsync(async (req, res) => {
    const adminMail = constants.ADMIN_EMAIL;
    const emailSubjectAdmin = constants.ADMIN_SUBJECT;
    const {bodyForAdmin} = await generateEmail(req.body);
    const uploadedFiles = [...(req.files.productOrderForm || [])];
    const verifyEmail = await resendService.triggerProductEmail(adminMail,
    emailSubjectAdmin,  bodyForAdmin, uploadedFiles);
    handleSuccess(httpStatus.OK, true, 'Email Sent Successfully.', req, res);
});

const sendCareersEmail = catchAsync(async (req, res) => {
        const { firstName, email } = req.body;
        const adminMail = constants.ADMIN_EMAIL;
        const emailSubjectAdmin = constants.ADMIN_SUBJECT;
        const userSubject = `${constants.CUSTOMER_SUBJECT} | ${firstName}`;
        const { bodyForAdmin, bodyForUser } = await generateEmail(req.body);
        const uploadedFiles = [...(req.files.resume || []), ...(req.files.coverLetter || [])];
        const verifyEmail = await resendService.triggerEmailForCareers(
            email,
            adminMail,
            userSubject,
            emailSubjectAdmin,
            bodyForAdmin,
            bodyForUser,
            uploadedFiles
        );
        handleSuccess(httpStatus.OK, { verifyEmail }, 'Email Sent Successfully.', req, res);
});

const subjectMatterExpertForm = catchAsync(async (req, res) => {
        const { fullName, email } = req.body;
        const adminMail = constants.ADMIN_EMAIL;
        const emailSubjectAdmin = constants.ADMIN_SUBJECT;
        const userSubject = `${constants.CUSTOMER_SUBJECT} | ${fullName}`;
        const { bodyForAdmin, bodyForUser } = await generateEmail(req.body);
        const uploadedFiles = [...(req.files.resume || [])];
        const verifyEmail = await resendService.triggerEmailForCareers(
            email,
            adminMail,
            userSubject,
            emailSubjectAdmin,
            bodyForAdmin,
            bodyForUser,
            uploadedFiles
        );
        handleSuccess(httpStatus.OK, { verifyEmail }, 'Email Sent Successfully.', req, res);
});
    

const transferPartnersForm = catchAsync(async (req, res) => {
        const { fullName, email } = req.body;
        const adminMail = constants.ADMIN_EMAIL;
        const emailSubjectAdmin = constants.ADMIN_SUBJECT;
        const userSubject = `${constants.CUSTOMER_SUBJECT} | ${fullName}`;
        const { bodyForAdmin, bodyForUser } = await generateEmail(req.body);
        const uploadedFiles = [...(req.files.support_doc || [])];
        const verifyEmail = await resendService.triggerEmailForCareers(
            email,
            adminMail,
            userSubject,
            emailSubjectAdmin,
            bodyForAdmin,
            bodyForUser,
            uploadedFiles
        );
        handleSuccess(httpStatus.OK, { verifyEmail }, 'Email Sent Successfully.', req, res);
});
    

const generateEmail = async (myData) => {
    const bodyForAdmin = await templateService.fetchAdminTemplate(myData);
    let bodyForUser = '';
    switch(myData.mailType) {
        case 'career':
            bodyForUser = await templateService.careerMailToUser(myData);
            break;
        case 'contact':
            bodyForUser = await templateService.contactMailToUser(myData);
            break;
        case 'news_letter':
            bodyForUser = await templateService.contactMailToUser(myData);
            break;
        case 'demo_form':
            bodyForUser = await templateService.careerMailToUser(myData);
            break;
        case 'product_order_form':
            bodyForUser = await templateService.contactMailToUser(myData);
            break;
        case 'request_for_training':
            bodyForUser = await templateService.contactMailToUser(myData);
            break; 
        case 'sme_form':
            bodyForUser = await templateService.contactMailToUser(myData);
            break;  
        case 'transfer_partner_form':
            bodyForUser = await templateService.contactMailToUser(myData);
            break;
    }
    return { bodyForAdmin, bodyForUser };
};


module.exports = {
    sendEmailToCustomer,
    sendCareersEmail,
    sendProductEmail,
    subjectMatterExpertForm,
    transferPartnersForm
};
