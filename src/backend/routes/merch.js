const express = require('express')
const router = express.Router()

const controller = require("../controller/merch")

router.get("/", controller.getAllData)
router.get("/items", controller.getAllItems)
router.get("/categories", controller.getAllCategories)
router.get("/item/:id", controller.getItemByID)
router.get("/items/category/:catID", controller.getItemsByCategoryName)
router.get("/items/category/:catID/:subID", controller.getItemsBySubName)
router.get("/filters/size", controller.getAllSizes)
router.get("/filters/color", controller.getAllColors)

module.exports = router