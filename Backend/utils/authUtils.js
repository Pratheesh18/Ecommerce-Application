const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;


const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salt);
}

const comparePasswords = async (password,hash) => {
    return bcrypt.compare(password,hash);
};

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId : user._id,
            firstName : user.firstName,
            lastName : user.lastName,
            userName : user.userName,
            email : user.email,
        },
        JWT_ACCESS_SECRET,
        {expiresIn:ACCESS_TOKEN_EXPIRES_IN}
    )
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId : user._id,
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
        },
        JWT_REFRESH_SECRET,
        {expiresIn:REFRESH_TOKEN_EXPIRES_IN}
    )
};


const verifyAccessToken = (token) => {
    return jwt.verify(token,JWT_ACCESS_SECRET);
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token , JWT_REFRESH_SECRET);
};



module.exports = {hashPassword,generateAccessToken,comparePasswords,generateRefreshToken,verifyAccessToken,verifyRefreshToken};