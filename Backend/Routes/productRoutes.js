const express = require('express');
const {addProduct} = require('../Controllers/productController');
const upload = require('../Middleware/multerMiddleware');

const router = express.Router();

router.post('/add',upload.single('image'),addProduct);

module.exports = router;