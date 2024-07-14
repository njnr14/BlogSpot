const { verfiyToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req , res , next) => {
        const tokenCookie = req.cookies[cookieName];
        if(!tokenCookie){
           return  next();
        }

        try {
            const userPayLoad = verfiyToken(tokenCookie);
            req.user = userPayLoad;
            // console.log(req.user);
        } catch (error) {}

       return  next();

    };
}


module.exports = {
    checkForAuthenticationCookie,
};