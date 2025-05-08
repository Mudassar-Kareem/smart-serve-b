const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const orderModel = require("../model/Order");
const userModel = require("../model/User");
const ErrorHandler = require("../utils/ErrorHandler");

//  create order
const createOrder = catchAsyncErrors(async(req,res,next) =>{
    try {
        const { items, totalPrice, name, phone, tableNo,restaurantId } = req.body;
        const user = await userModel.findById(restaurantId);
        console.log(user);
        if(user.status === "Deactive"){
            return next(new ErrorHandler("Sorry, this restaurant is currently unavailable for orders. Please try again later.", 403));
        }
        const order = await orderModel.create({
            restaurantId,
            items,
            totalPrice,
            name,
            phone,
            tableNo,
        })
        res.status(201).json({
            success: true,
            order,
            message: "Order Created successfully",
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// get all order 
const getOrders = catchAsyncErrors(async(req,res,next)=>{
    try {
        let orders = await orderModel.find({restaurantId: req.user.id})
        orders.sort((a,b)=>{
            const timeA = new Date(a.createdAt);
            const timeB = new Date(b.createdAt);
            return timeA - timeB;
        })
        res.status(200).json({
            success: true,
            orders,
            message: "Orders fetched successfully",
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// change order status
const orderStatus = catchAsyncErrors(async(req,res,next)=>{
    try {
        const order = await orderModel.findById(req.params.id)
        if(!order){
            return next(new ErrorHandler("Order not found", 404));
        }
        if(order.status === "Pending"){
            order.status = "Ready"
        }else if(order.status === "Ready"){
            order.status = "Served"
        }
        await order.save()
        res.status(200).json({
            success: true,
            order,
            message: "Order status updated successfully",
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// change paymeny status
const paymentStatus = catchAsyncErrors(async(req,res,next)=>{
    try {
        const order = await orderModel.findById(req.params.id)
        if(!order){
            return next(new ErrorHandler("Order not found", 404));
        }
        if(order.paymentStatus === "Paid"){
            return next(new ErrorHandler("Order already paid", 400));
        }
        order.paymentStatus = "Paid"
        await order.save()
        res.status(200).json({
            success: true,
            order,
            message: "Payment status updated successfully",
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


module.exports = {createOrder,getOrders,orderStatus,paymentStatus}