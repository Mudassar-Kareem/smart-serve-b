const express = require('express');
const { createUser, login, loadUser, getAllUser, updateStatus, updateInfo, logout } = require('../controller/userController');
const { isUser, isAdmin } = require('../middleware/auth');
const userRouter = express.Router();

userRouter.post("/register",createUser)
userRouter.post("/login",login)
userRouter.get("/me",isUser,loadUser)
userRouter.get("/all-user",isUser,isAdmin,getAllUser)
userRouter.put("/update-status/:id",isUser,isAdmin,updateStatus)
userRouter.put("/update-info",isUser,updateInfo)
userRouter.get("/logout",logout)

module.exports = userRouter;