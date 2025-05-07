const express = require('express');
const { createItem, updateMenu, deleteMenu, allItem } = require('../controller/menuController');
const menuRouter = express.Router();
const { isUser} = require('../middleware/auth');

menuRouter.post("/create",isUser,createItem)
menuRouter.put("/update/:id",isUser,updateMenu)
menuRouter.delete("/delete/:id",isUser,deleteMenu)
menuRouter.get("/getAll/:id",allItem)

module.exports = menuRouter;