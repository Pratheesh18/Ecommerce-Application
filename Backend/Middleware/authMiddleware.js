const {verifyAccessToken} = require('../utils/authUtils');

const authenticate = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];

    if(!token){
        return res.status(401).json({message:'Access Token Required'});
    }

    try{
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    }catch(error){
        res.status(403).json({message:'Invalid or Expired access token'});
    }
};

module.exports = authenticate;