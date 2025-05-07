require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const menuRouter = require("./routes/menuRoute");
const errorMiddleware = require("./middleware/error");

const app = express();
const corsOptions = {
    origin:["http://localhost:5173","https://smartserve-seven.vercel.app"],     
    optionsSuccessStatus: 200, 
    credentials: true,
};
app.use(cors(corsOptions))
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Testing API
app.get("/",(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"API is working"
    })
})

app.use("/api/v1/user",userRouter)
app.use("/api/v1/menu",menuRouter)

app.use(errorMiddleware)

module.exports ={app}