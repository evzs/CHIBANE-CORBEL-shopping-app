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
    try {
        const id = parseInt(req.params.catID)
        const category = data.categories.find(item => item.id == id)
        const result = data.items.filter(item => item.category == category.name)

        res.status(200).json({
        message: "All items found successfully",
        items: result
        })
    } catch {
        res.status(404).json(
            {"title": "An error occurred",
            "status": 404,
            "message": "Items not found."}
        )
        return
    }
}
exports.getItemsBySubName = (req, res) => {
    try {
        const catID = parseInt(req.params.catID)
        const subID = parseInt(req.params.subID)

        const category = data.categories.find(item => item.id == catID)
       
        const subcategory = category.subcategories[subID]
    
        const result = data.items.filter(item => {
            return item.category == category.name && item.subcategory == subcategory.name
        })

        res.status(200).json({
        message: "All items found successfully",
        items: result
        })
    } catch {
        res.status(404).json(
            {"title": "An error occurred",
            "status": 404,
            "message": "Items not found."}
        )
        return
    }
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

exports.getItemsByVariant = (req, res) => {
    const slug = req.params.slug.toLowerCase()
    const result = data.items.filter(item => item.slug.toLowerCase() == slug)
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