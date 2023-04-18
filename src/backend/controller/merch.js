const old_data = require("../old_data.json");
const data = require("../data.json")
exports.getAllItems = (req, res) => {
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