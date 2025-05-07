const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    restaurantName:{
        type: String,
        required: [true, "Please enter your name!"],
      },
      address: { 
        type: String,
        required: [true, "Please enter your Restaurant name!"],
      },
      type: {
        type: String,
        required: [true, "Please enter your Restaurant type!"],
        enum: ["Shop", "Cafe", "FastFood", "FineDining", "Bakery"],
      },
      contactNo:{
        type: String,
        required: [true, "Please enter your contact number!"],
      },
      name:{
        type: String,
        required: [true, "Please enter your name!"],
      },
      email: {
        type: String,
        required: [true, "Please enter your email!"],
      },
      password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password should be greater than 6 characters"],
        select: false,
      },
      role:{
        type:String,
        default:"user"
      },
      status:{
        type:String,
        default:"Active"
      },
},{timestamps:true});

// hash password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

// compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

// get jwt token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: "7d",
    })
}

const userModel = mongoose.model("User",userSchema);
module.exports = userModel;
