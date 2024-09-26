const { createHmac,randomBytes } = require("crypto");
const { Schema , model } = require("mongoose");
const { createTokenforUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password: {
        type:String,
        required:true,
    },
    profileImageURL: {
        type:String,
        default:"/images/download.png",
    },
    role: {
        type:String,
        enum:["USER" , "ADMIN"],
        dafault:"USER",
    },
},
{timestampes:true}
);

userSchema.pre("save" , function(next){

    const user=this;

    if(!user.isModified("password")) return ;

    const salt= randomBytes(16).toString();
    const hashedPassword = createHmac("sha256" , salt).update(user.password).digest("hex");

    this.salt=salt;
    this.password=hashedPassword;
})

userSchema.static("matchPasswordAndgenerateToken" , async function(email,password){
    const user = this.findOne({email});
    if (!user) throw new error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userprovidedHash = createHmac("sha256" , salt).update(password).digest("hex");

    if(hashedPassword!==userprovidedHash) throw new error("Incorrect Password");

    const token = createTokenforUser(user);
    return token;
})

const User=model("user" , userSchema);

module.exports=User;