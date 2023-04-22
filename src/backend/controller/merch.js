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

exports.getItemByID = (req, res) => {
    const id = parseInt(req.params.id)
    const result = data.items.find(item => item.id == id)
    if (!result) {
        res.status(404).json(
            {"title": "An error occurred",
            "status": 404,
            "message": "Item not found."}
        )
            return
    }
    res.status(200).json({
        message: "Item found successfully.",
        items: result
    })
}

exports.getItemsByCategoryName = (req, res) => {
    const categoryName = req.params.catID.toLowerCase()
    const result = data.items.filter(item => item.category.toLowerCase() == categoryName)
    if (!result) {
        res.status(404).json(
            {"title": "An error occurred",
            "status": 404,
            "message": "Items not found."}
        )
            return
    }
    res.status(200).json({
    message: "All items found successfully",
    items: result
    })
}
exports.getItemsBySubName = (req, res) => {
    const categoryName = req.params.catID.toLowerCase()
    const subcategoryName = req.params.subID.toLowerCase()
    const result = data.items.filter(item => {
        return item.category.toLowerCase() == categoryName && item.subcategory.toLowerCase() == subcategoryName
    })
    if (!result) {
        res.status(404).json(
            {"title": "An error occurred",
            "status": 404,
            "message": "Items not found."}
        )
            return
    }
    res.status(200).json({
    message: "All items found successfully",
    items: result
    })
}

exports.getAllData = (req, res) => {
    console.log(data)
    if (!data) {
        res.status(404).json(
            {
                "title": "An error occurred",
                "status": 404,
                "message": "Items not found."
            }
        )
        return
    }
    res.status(200).json({
        message: "All data found successfully",
        data
    })
}

exports.getAllCategories = (req, res) => {
    const categories = data.categories
    if (!categories) {
        res.status(404).json(
            {
                "title": "An error occurred",
                "status": 404,
                "message": "Categories not found."
            }
        )
        return
    }
    res.status(200).json({
        message: "All data found successfully",
        categories
    })
}