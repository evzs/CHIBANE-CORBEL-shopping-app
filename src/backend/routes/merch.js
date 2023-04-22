const express = require('express')
const router = express.Router()

const controller = require("../controller/merch")

router.get("/sneaker/:id", controller.getSneakerByID)
router.get("/sneakers/", controller.getSneakers)
router.get("/items", controller.getAllItems)
router.get("/items/:id", controller.getItemByID)
router.get("/items/category/:name", controller.getItemsByCategoryName)

module.exports = router