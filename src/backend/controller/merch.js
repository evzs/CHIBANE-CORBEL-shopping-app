const data = require("../data.json")

// Retrieves all the items.
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

// Retrieves an item by its ID.
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
        item: result
    })
}

// Retrieves all items from a category.
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

// Retrieves all items from a category and a subcategory.
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

// Retrieves all the data (items + categories).
exports.getAllData = (req, res) => {
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

// Retrieves all the categories and subcategories in the data.
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

// Retrieves all present colors and sizes in the data.
exports.getAllSizes = (req, res) => {
    let result = [] 
    data.items.forEach(element => {
        Array.from(Object.keys(element.sizes)).forEach(size => {
            if (!result.includes(size)) {
                result.push(size)
            }
        })
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
        sizes: result
    })
}
exports.getAllColors = (req, res) => {
    let result = [] 
    data.items.forEach(element => {
        if (!result.includes(element.color.category)) {
            result.push(element.color.category)
        }
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
        sizes: result
    })
}