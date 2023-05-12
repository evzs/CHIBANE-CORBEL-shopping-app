let filters = document.querySelectorAll(".filter-container")
if (filters) {
    filters.forEach((filter, index) => {
        // Tracks the checkboxes
        var allcheckboxes = filter.querySelectorAll("input[type='checkbox']")
        if (allcheckboxes) {
            allcheckboxes.forEach(checkbox => {
                checkbox.addEventListener("change", function () {
                    let checkCount = countAllChecked(allcheckboxes)
                    document.querySelectorAll(".count .number")[index].innerHTML = checkCount == 0 || checkCount == allcheckboxes.length ? "all" : checkCount
                })
            })
        }

        // Show or hide full filter menu
        filter.querySelector(".filter-title").addEventListener("click", function () {
            if (filter.querySelector(".filter-options-container").classList.contains("visible")) {
                filter.querySelector(".filter-options-container").classList.remove("visible")
            } else {
                removeClassFromAll(document.querySelectorAll(".filter-options-container"), "visible")
                filter.querySelector(".filter-options-container").classList.add("visible")
            }
        })
    })
}

// Count all checkboxes checked in a array of checkboxes.
function countAllChecked(checkboxes) {
    if (!checkboxes) {
        return 0
    }
    let total = 0
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            total++
        }
    })
    return total
}

document.addEventListener("click", function (e) {
    let filters = document.querySelectorAll(".filter-options-container")
    let quickCart = document.querySelector("aside")
    let $target = $(e.target)

    if ($target.parents(".filter-options-container").length > 0 
    || $target.hasClass("filter-options-container")
    || $target.parents(".filter-title.activable").length > 0 
    || $target.hasClass("filter-title activable")) {
        return
    }
    removeClassFromAll(filters, "visible")
})

let filtersInputs = document.querySelectorAll("input[type='checkbox'], input[type='radio']")

if (filtersInputs) {
    filtersInputs.forEach(input => {
        input.addEventListener("change", function () {
            updateItems(currentCategory, currentSubCategory, retrieveFilters())
        })
    })
}

function unsetFilters() {
    document.querySelectorAll("input[type='checkbox']").forEach(input => input.checked = false)
    document.querySelectorAll(".count .number").forEach(element => element.innerHTML = "all")
}

function applyFilters(items = [], filters = {}) {
    if (!Object.keys(filters) || !items) {
        return items
    }
    let filterlist = filters["filter-list"]
    items = items.filter(item => {
        return itemHasCat(filterlist.brand, item) && itemHasColor(filterlist.color, item) && itemHasAvailableSize(filterlist.size, item)
    })
    // color, brand(cat), size
    

    
    items.sort((a, b) => {
        switch (filters["sort-by"]) {
            case "price-low":
                return (a.price - (a.price * a.reduction / 100)) - (b.price - (b.price * b.reduction / 100))
            case "price-high":
                return (b.price - (b.price * b.reduction / 100)) - (a.price - (a.price * a.reduction / 100))
            case "sale":
                if (b - a == 0) {
                    return (b.price - (b.price * b.reduction / 100)) - (a.price - (a.price * a.reduction / 100))
                }
                return (b.reduction - a.reduction)
            case "default":
                return (b.id - a.id)
        }
    });
    return items
}


function retrieveFilters() {
    let filters = {
        "filter-list": [],
        "sort-by": []
    }
    let sortValue = document.querySelector("input[name='sort-by']:checked").value;

    filters["sort-by"] = sortValue ? sortValue : "no-sort";
    filters["filter-list"] = {
        "color": Array.from(document.querySelectorAll(`input[name='color']:checked`), e => e.value),
        "brand": Array.from(document.querySelectorAll(`input[name='brand']:checked`), e => e.value),
        "size": Array.from(document.querySelectorAll(`input[name='size']:checked`), e => e.value)
    }
    return filters
}

function itemHasColor(colors = [], item) {
    return colors.length == 0 || colors.includes(item.color.category)
}
function itemHasCat(brand = [], item) {
    console.log(brand, item.brand)
    return brand.length == 0 || brand.includes(item.brand.toLowerCase())
}
function itemHasAvailableSize(sizes = [], item) {
    return sizes.length == 0 || (
        Array.from(Object.keys(item.sizes)).some(size => {
            return item.sizes[size] && sizes.includes(size)
        })
    )
}
 // !END FILTERS
