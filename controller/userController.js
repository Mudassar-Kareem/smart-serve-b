const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const userModel = require("../model/User");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");

// create user
const createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { restaurantName, address, type, contactNo, name, email, password } =req.body;
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exists", 400));
    }
    const user = await userModel.create({
      restaurantName,
      address,
      type,
      contactNo,
      name,
      email,
      password,
    });
    sendToken(user, 201, res, "User created successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendToken(user, 200, res, "Login successful");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// load user
const loadUser = catchAsyncErrors(async (req,res,next)=>{
    try {
        const user = await userModel.findById(req.user.id);
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// get All User --- Admin
const getAllUser = catchAsyncErrors(async(req,res,next)=>{
   try {
    const users = await userModel.find({role:"user"}).sort({createdAt:-1});
    if(!users){
        return next(new ErrorHandler("No user found",404))
    }
    res.status(200).json({
        success:true,
        users
    })
   } catch (error) {
    return next(new ErrorHandler(error.message, 500));
   }
})

// change user status --Admin
const updateStatus = catchAsyncErrors(async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.params.id);
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        if(user.status === "Active"){
            user.status = "Deactive"
        } else{
            user.status = "Active"
        }
        await user.save();
        res.status(200).json({
            success:true,
            message:"User status updated successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// update user info
const updateInfo = catchAsyncErrors(async(req,res,next)=>{
    try {
        const {name,restaurantName,email,contactNo} = req.body;
        const user = await userModel.findOne({email})
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        if(name) user.name = name;
        if(restaurantName) user.restaurantName = restaurantName;
        if(contactNo) user.contactNo = contactNo;
        await user.save();
        res.status(200).json({
            success:true,
            message:"User info updated successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// user logout
const logout = catchAsyncErrors(async (req,res,next)=>{
    try {
        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })
        res.status(200).json({
            success:true,
            message:"Logout successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}
)



module.exports = { createUser,login,loadUser,getAllUser,logout,updateStatus,updateInfo };
