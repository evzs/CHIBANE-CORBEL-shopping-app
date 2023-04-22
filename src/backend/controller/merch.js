const old_data = require("../old_data.json");
const data = require("../data.json")
exports.getAllItems = (req, res) => {
    var separated = req.query.display
    console.log(separated)
    const items = data.items;
    if (!items) {
        res.status(404).json({
            message: "No items found"
        })
        return
    }
    res.status(200).json({
        message: "All items found successfully",
        items
    })
} 

exports.getSneakers = (req, res) => {
    const sneakers = old_data.sneakers
    if (!sneakers) {
        res.status(404).json({
            message: "Sneakers not found"
        })
        return
    }
    res.status(200).json({
        message: "Sneakers found successfully",
        sneakers
    })
}

exports.getSneakerByID = (req, res) => {
    const id = parseInt(req.params.id)
    const sneakers = old_data.sneakers
    const sneaker = sneakers.find(s => s.id === id)
    if (!sneaker) {
        res.status(404).json({
            message: "Sneaker not found"
        })
        return
    }
    res.status(200).json({
        message: "Sneaker found successfully",
        sneaker
    }) 
}

exports.getItemByID = (req, res) => {
    const id = parseInt(req.params.id)
    const items = data.items
    const item = (function () {
        for (let i = 0; i < items.length; i++) {
            let result = items[i].variants.find(i => i.id == id)
            if (typeof result != "undefined") {
                return result
            }
        }
        return null
    })()
    if (!item) {
        res.status(404).json(
            {"title": "An error occurred",
            "status": 404,
            "message": "Item not found."}
        )
            return
    }
    res.status(200).json({
        item
    })
}

exports.getItemsByCategoryName = (req, res) => {
    const categoryName = req.params.name 
    console.log(categoryName.toLowerCase())
}