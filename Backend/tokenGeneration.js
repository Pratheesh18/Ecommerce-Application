const crypto = require('crypto');

const accessToken = crypto.randomBytes(32).toString('hex');
console.log("Access Token Secret " , accessToken);

const refreshToken = crypto.randomBytes(32).toString('hex');
console.log("Refresh Token " , refreshToken);