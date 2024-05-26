const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    OAuthID:{
        type:String,
    },
    email:{
        type:String,
        // required:true,
        lowercase:true
    },
    userType:{
        type:String
    }
});

const UserModel = new mongoose.model("User",UserSchema);

module.exports = UserModel;