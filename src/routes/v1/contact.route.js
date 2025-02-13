const express = require('express');
const validate = require('../../middlewares/validate');
const resendValidation = require('../../validations/resend.validation');
const resendController = require('../../controllers/resend.controller');
const router = express.Router();
const fileUpload = require('../../middlewares/file-upload');


// Email Sending APIs
router.post('/contact_us', validate(resendValidation.contact_us), resendController.sendEmailToCustomer);
router.post('/product_order_form', fileUpload.multiFileUpload, validate(resendValidation.product_order_form), resendController.sendProductEmail);
router.post('/careers', fileUpload.multiFileUpload, validate(resendValidation.careers), resendController.sendCareersEmail);
router.post('/news-letter', validate(resendValidation.news_letter), resendController.captureNewsLetter);

module.exports = router;
