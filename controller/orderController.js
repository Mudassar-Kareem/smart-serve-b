const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const orderModel = require("../model/Order");
const ErrorHandler = require("../utils/ErrorHandler");

//  create order
const createOrder = catchAsyncErrors(async(req,res,next) =>{
    try {
        const { items, totalPrice, name, phone, tableNo,restaurantId } = req.body;
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


module.exports = {createOrder}