const User = require('../Models/userModel');
const {hashPassword , comparePasswords,generateAccessToken , generateRefreshToken,verifyRefreshToken} = require('../utils/authUtils');


const register = async (req,res) => {
    try{
        const {firstName,lastName,userName,email,password,confirmPassword} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({message:'Passwords do not match'});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'Email is already in use'});
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPassword
        });

        await newUser.save();
        res.status(201).json({message:'User registered successfully'});

    }catch(error){
        res.status(500).json({message:'Server Error',error})
    }
};


const login = async (req,res) => {
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user || !(await comparePasswords(password,user.password))){
            return res.status(400).json({message:"Invalide Credentials"});
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        res.json({accessToken,refreshToken});
    }catch(error){
        res.status(500).json({message:'Server Error',error});
    }
};

const refreshToken = async (req,res) => {
    try{
        const {refreshToken} = req.body;

        if(!refreshToken){
            return res.status(401).json({message:'Reftesh token required'});
        };

        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.userId);

        if(!user){
            return res.status(501).json({message:'Invalid Refresh Token'});
        }

        const newAccessToken = generateAccessToken(user._id.toString());
        res.json({accessToken:newAccessToken});
    }catch(error){
        res.status(500).json({message:'Server error',error});
    };
};

module.exports = {register,login,refreshToken};