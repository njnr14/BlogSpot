const {Schema , model} = require("mongoose");
const {createHmac , randomBytes} = require("crypto");
const { error } = require("console");
const {createTokenForUser} = require('../services/authentication');

const UserSchema = new Schema({
    fullName : {
        type : String,
        required : true,
    },

    email : {
        type : String,
        required : true,
        unique : true,
    },

    salt :{
        type : String,
        
    },

    password : {
        type : String,
        required : true,
    },

    profileImageURL : {
        type  : String,
        default : "/image/user.png",
    },

    role : {
        type : String,
        enum : ["USER" , "ADMIN"],
        default : "USER",
    }


} , {timestamps : true});


UserSchema.pre("save" , function(next) {
    const user = this;

    if(!user.isModified("password"))return;

    const salt = randomBytes(16).toString();
    // const salt = "hello";

    const hashedPassword  = createHmac('sha256' , salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

UserSchema.static("matchPasswordAndGenerateToken" , async function(email , password){
    const user = await this.findOne({email});
    
    if(!user)throw new Error("user not found");
    // console.log(user);

    const salt  = user.salt;
    const userPassword = user.password;

    
    
    const hashedPassword  = createHmac('sha256' , salt)
    .update(password)
    .digest("hex");
    // console.log(userPassword);
    // console.log(hashedPassword);
    if(hashedPassword !== userPassword)throw new Error("incorrect password");

    const token = createTokenForUser(user);
    return token;

});


const User = model('user' , UserSchema);

module.exports = {
    User
}   