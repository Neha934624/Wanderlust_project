const mongoose=require("mongoose")
let Schema=mongoose.Schema;
const passport_local_mongoose=require("passport-local-mongoose");
const { type } = require("../schema");
const { required } = require("joi");

//HERE passport-local-mongoose will automaticaly generate the username and password 
let User=new Schema({
    email:{
        type:String,
        required:true
    }
})
User.plugin(passport_local_mongoose)

module.exports=mongoose.model("User",User)

