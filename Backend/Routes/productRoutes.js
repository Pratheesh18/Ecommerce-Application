const express = require('express');
const {addProduct,getAllProducts} = require('../Controllers/productController');
const upload = require('../Middleware/multerMiddleware');

const router = express.Router();

router.post('/add',upload.single('image'),addProduct);
router.get('/getAll',getAllProducts);

module.exports = router;