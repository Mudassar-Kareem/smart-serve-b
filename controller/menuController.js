const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const MenuItem = require("../model/MenuItem");
const ErrorHandler = require("../utils/ErrorHandler");
const userModel = require("../model/User");

// add a new menu item
const createItem = catchAsyncErrors(async (req, res, next) => {
  try {
    const restaurantId = req.user.id;
    const restaurant = await userModel.findById(restaurantId);
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }
    const { name, category, price, image } = req.body;
    const menuItem = await MenuItem.create({
      name,
      category,
      price,
      image,
      restaurantId,
    });
    res.status(201).json({
      success: true,
      menuItem,
      message: "Menu Item Created successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update a menu item
const updateMenu = catchAsyncErrors(async (req, res, next) => {
  try {
    const restaurantId = req.user.id;
    const { name, category, price, image } = req.body;
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return next(new ErrorHandler("Menu Item not found", 404));
    }
    if (menuItem.restaurantId.toString() !== restaurantId) {
      return next(
        new ErrorHandler("You are not authorized to update this menu item", 403)
      );
    }
    if (name) menuItem.name = name;
    if (category) menuItem.category = category;
    if (price) menuItem.price = price;
    if (image) menuItem.image = image;
    await menuItem.save();
    res.status(200).json({
      success: true,
      menuItem,
      message: "Menu Item updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete a menu item
const deleteMenu = catchAsyncErrors(async(req,res,next)=>{
    try {
        const restaurantId = req.user.id;
        const menuItem = await MenuItem.findById(req.params.id);
        if(!menuItem){
            return next(new ErrorHandler("Menu Item not found",404))
        }
        if(menuItem.restaurantId.toString() !== restaurantId){
            return next(new ErrorHandler("You are not authorized to delete this menu item",403))
        }
        await menuItem.deleteOne();
        res.status(200).json({
            success:true,
            message:"Menu Item deleted successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// get all menu items of a restaurant
const  allItem = catchAsyncErrors(async(req,res,next)=>{
    try {
        const restaurantId = req.params.id;
        const menuItems = await MenuItem.find({restaurantId}).sort({createdAt:-1});
        if(!menuItems){
            return next(new ErrorHandler("No menu items found",404))
        }
        res.status(200).json({
            success:true,
            menuItems
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
        
    }
})

module.exports = {
  createItem,
  updateMenu,
  deleteMenu,
  allItem,
};
