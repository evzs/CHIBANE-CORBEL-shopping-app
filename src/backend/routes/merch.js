const express = require('express')
const router = express.Router()

const controller = require("../controller/merch")
router.get("/", controller.getAllData)
router.get("/items", controller.getAllItems)
router.get("/items/:id", controller.getItemByID)
router.get("/items/category/:name", controller.getItemsByCategoryName)
router.get("/items/category/:name/:subname", controller.getItemsBySubName)

module.exports = router