const JWT = require("jsonwebtoken");

const secret = "supersecret@123!@#";

function createTokenForUser(user){

    const payload = {
        _id : user._id,
        email : user.email,
        profileURL : user.profileImageURL,
        role : user.role,
    }

    const token = JWT.sign(payload , secret);
    return token;

};

function verfiyToken(token){

    const payload = JWT.verify(token , secret);
    // console.log(payload);
    return payload;

};

module.exports = {
    createTokenForUser,
    verfiyToken,    
};