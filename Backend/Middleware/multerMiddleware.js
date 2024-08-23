const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req,res,cb) => {
        cb(null,'uploads/')
    },
    filename : (req,file,cb) => {
        cb(null,`${Date.now()} - ${path.basename(file.originalname)}`);
    }
});

const fileFilter = (req,file,cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error : Images Only!');
    }
};

const upload = multer({
    storage : storage,
    fileFilter : fileFilter,
    limits : {fileSize:1024*1024*5} //5 mb limit
});

module.exports = upload;