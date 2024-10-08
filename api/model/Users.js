const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:4,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:16
    },
    profilePicture:{
        type:String, 
        default:""
    },
    friends:{
        type:Array,
        defalut:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timeseries:true});
module.exports = mongoose.model("User" , UserSchema);