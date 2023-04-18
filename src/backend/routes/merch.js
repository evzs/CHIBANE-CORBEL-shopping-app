const express = require('express')
const router = express.Router()

const controller = require("../controller/merch")

router.get("/sneaker/:id", controller.getSneakerByID)
router.get("/sneakers/", controller.getSneakers)
router.get("/", controller.getAllItems)

module.exports = router