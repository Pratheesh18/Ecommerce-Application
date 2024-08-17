const express = require('express');
const {register , login,refreshToken} = require('../Controllers/authController');
const authenticate = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/refresh-token',refreshToken);

router.get('/profile',authenticate,(req,res) => {
    res.json({message : 'This is protected route',user:req.user});
});


module.exports = router;