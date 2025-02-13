const multer = require("multer");
const path = require("path");

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/attachments")); // Store files in public/attachments
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext); // File will be saved as resume-123456789.pdf, coverLetter-987654321.docx
    }
});

// Multer upload setup
const multiFileUpload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        // Allowed file types
        const allowedMimeTypes = [
            "image/jpeg", 
            "image/png", 
            "application/pdf", 
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        ];
        
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, PDF, DOC, and DOCX files are allowed!"), false);
        }
        cb(null, true);
    }
}).fields([
    { name: "resume", maxCount: 1 }, 
    { name: "coverLetter", maxCount: 1 },
    { name: "email", maxCount: 1 },
    { name: "productOrderForm", maxCount: 1 }
]); // Expecting two named files

module.exports = {
    multiFileUpload
};
