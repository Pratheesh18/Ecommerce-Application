const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname,'uploads/');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Created uploads directory at: ${uploadPath}`);
} else {
    console.log(`Uploads directory already exists at: ${uploadPath}`);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Use absolute path to the uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${path.basename(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (req,file,cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb(new Error('Error : Images Only!'));
    }
};

const upload = multer({
    storage : storage,
    fileFilter : fileFilter,
    limits : {fileSize:1024*1024*5} //5 mb limit
});

module.exports = upload;