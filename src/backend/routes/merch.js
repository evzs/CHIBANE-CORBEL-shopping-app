const express = require('express')
const router = express.Router()

const controller = require("../controller/merch")
router.get("/", controller.getAllData)
router.get("/items", controller.getAllItems)
router.get("/categories", controller.getAllCategories)
router.get("/item/:id", controller.getItemByID)
router.get("/items/variant/:slug", controller.getItemsByVariant)
router.get("/items/category/:catID", controller.getItemsByCategoryName)
router.get("/items/category/:name/:subID", controller.getItemsBySubName)

module.exports = router