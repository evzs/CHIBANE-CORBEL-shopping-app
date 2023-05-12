let cart = []

function retrieveFromLocal() {
    if (localStorage.getItem("cart") === null) {
        return false
    }
    cart = JSON.parse(localStorage.getItem("cart"));
    return true
}
function saveToLocal() {
    localStorage.setItem("cart", JSON.stringify(cart))
}
retrieveFromLocal()




const url = "http://localhost:5501/"
let currentCategory = -1;
let currentSubCategory = -1;
// *---- CATEGORIES --- //

function getCategories() {
    fetch(url + "categories/")
    .then(response => response.json())
    .then(response => {
        if (!response || !response.categories) {
            return
        }
        generateCategories(response.categories)
        return response.categories
    })
    .catch(error => console.log(`Error while fetching url: ${error}`))
} 

function selectCategory(catTitle, subcatTitle = null) {
    document.querySelectorAll(".cat-title,.subcat-title").forEach(div => {
        div.classList.remove("selected")
    })
    catTitle.classList.add("selected")
    if (subcatTitle) {
        subcatTitle.classList.add("selected")
    }
    unsetFilters()
}

function changeTitle(category, subcategory = "") {
    let titleDiv = document.querySelector("h1")
    let subtitleDiv = document.querySelector(".sub")

    if (titleDiv) {
        titleDiv.innerHTML = subcategory ? subcategory : `All ${category}`;
    }
    if (subtitleDiv) {
        subtitleDiv.innerHTML = `${category} > ${subcategory}`
    }
}

function generateCategories(categories) {
    // Adds listener to the "Show all" link:
    document.querySelector(".show-all").addEventListener("click", function () {
        currentCategory = -1
        currentSubCategory = -1
        selectCategory(this)
        changeTitle("Articles")
        updateItems()
    })

    let container = document.querySelector(".categories")
    if (!container || !categories) {
        return
    }
    
    categories.forEach(category => {
        let catCtn = document.createElement("div"); catCtn.classList.add("category-ctn")
        let catTitle = document.createElement("div"); catTitle.classList.add("cat-title"); catTitle.innerHTML = `${category.name}`
        catTitle.addEventListener("click", function () {
            currentCategory = category.id
            currentSubCategory = -1
            selectCategory(catTitle)
            changeTitle(category.name)
            updateItems(category.id)
        })
        catCtn.appendChild(catTitle);
        let subcatCtn = generateSubCategories(category, catTitle)
        if (subcatCtn) {
            catCtn.appendChild(subcatCtn)
        }
        container.appendChild(catCtn)
    })
}

function generateSubCategories(category, catContainer) {
    if (!category.subcategories) {
        return
    }
    let subcatContainer = document.createElement("div"); subcatContainer.classList.add("subcat-ctn")
    category.subcategories.forEach(subcategory => {
        let subcatTitle = document.createElement("div"); subcatTitle.classList.add("subcat-title"); subcatTitle.innerHTML = `${subcategory.name}`
        subcatTitle.addEventListener("click", function () {
            currentCategory = category.id
            currentSubCategory = subcategory.id
            selectCategory(catContainer, subcatTitle)
            changeTitle(category.name, subcategory.name)
            updateItems(category.id, subcategory.id)
        })
        subcatContainer.appendChild(subcatTitle)
    })
    return subcatContainer
}

getCategories()

// *------------------- //

// *----- ARTICLES ---- //

function getArticles(endpoint = "", filters = {}) {
    fetch(url + `items/${endpoint}`)
    .then(response => response.json())
    .then(response => {
        // VIDE?
        if (!response || !response.items) {
            return
        } else if (!Object.keys(filters).length) {
            generateArticles(response.items)
        } else {
            filteredItems = applyFilters(response.items, filters)
            generateArticles(filteredItems)
        } 
        return response.items
    })
    .catch(error => console.log(`Error while fetching url: ${error}`))
}

function generateArticles(items) {
    let container = document.querySelector(".articles-ctn")
    if (!container) {
        return
    }
    container.innerHTML = "";
    if (items) {
        items.forEach(item => generateBaseItem(item, container))
    } else {
        console.log("no items to show ?")
    }
    
}

function generateBaseItem(item, container) {
    let itemDiv = document.createElement("div")
    itemDiv.classList.add("article-item");
    itemDiv.innerHTML = `
    <div class="article-img">
        <img class="first" src="${url}${item.images[0]}">
        <img class="second" src="${url}${item.images[1]}">
        <div class="quick-cart">
            <div class="choose-size">Choose your size:</div>
            <div class="sizes-container"></div>
        </div>
        ${item.reduction ? '<div class="reduction">-'+item.reduction+'%</div>' : ''}
    </div>
    <div class="article-info">
        <div class="brand">${item.brand}</div>
        <div class="name">${item.title} - ${item.color.category}</div>
        <div class="price-see-more">
            ${generatePrice(item)}
            <a href="article.html?articleID=${item.id}" target="_blank" class="see-more">See more >></a>
        </div>

    </div>`
    generateQuickCart(item, itemDiv)
    container.appendChild(itemDiv)
    
}

function generatePrice(item) {
    return item.reduction ?
        `<div class="price"><span class="new">${addZeros(item.price - (item.price * item.reduction /100))}€</span><span class="former">${addZeros(item.price)}€</span></div>`
        : `<div class="price">${addZeros(item.price)}€</div>`

} 
getArticles()

function generateQuickCart(item, container) {
    if (!container.querySelector(".sizes-container")) {
        console.warn("no parent div?")
    }
    Array.from(Object.keys(item.sizes)).forEach(size => {
        div = document.createElement("div");
        div.innerHTML = size
        if (item.sizes[size]) {
            div.classList.add("size", "available");
            div.addEventListener("click", function () {
                addToCart(item, size)
            })
            
        } else {
            div.classList.add("size", "not-available");
        }
        container.querySelector(".sizes-container").appendChild(div)
    })
}

function addToCart(item, size, quantity = 1) {
    let existing = cart.find(i => i.item_id == item.id && i.size == size)
    if (existing) {
        existing.quantity += quantity;
        let existingDiv = document.querySelector(`[dataid='${item.id}'][datasize='${size}']`)
        updateCartItemDiv(existingDiv, existing)
    } else {
        let newItem = {
            item_id: item.id,
            size: size,
            quantity: quantity,
            item_info: {
                id: item.id,
                title: item.title,
                image: item.images[0],
                color: item.color.name,
                price: item.price,
                reduction: item.reduction
            }
        }
        cart.push(newItem)
        generateCartItem(newItem)
    }
    saveToLocal()
    updateQuickCart()
}

function addToExistingCart(item, quantity = 1) {
    item.quantity += quantity;
    saveToLocal()
}


function addZeros(number) {
    number = Number(number)
    if (isNaN(number)) {
        return 0
    }
    return number.toLocaleString("en",{useGrouping: false,minimumFractionDigits: 2});
}

function updateItems(catID = -1, subcatID = -1, filters = []) {
    if (catID < 0) {
        getArticles("", filters)
    } else if (subcatID < 0) {
        getArticles(`category/${catID}`, filters)
    } else {
        getArticles(`category/${catID}/${subcatID}`, filters)
    }
} 

function removeClassFromAll(divArr, className) {
    if (divArr.length == 0) {
        return
    }
    divArr.forEach(div => {
        div.classList.remove(className)
    })
}

const ALL_FILTERS = ["color", "brand", "size"];

// ?SEARCH PAGE - Filters
let filters = document.querySelectorAll(".filter-container")
if (filters) {
    filters.forEach((filter, index) => {
        // Tracks the checkboxes
        var allcheckboxes = filter.querySelectorAll("input[type='checkbox']")
        if (allcheckboxes) {
            allcheckboxes.forEach(checkbox => {
                checkbox.addEventListener("change", function() {
                    let checkCount = countAllChecked(allcheckboxes)
                    document.querySelectorAll(".count .number")[index].innerHTML = checkCount == 0 || checkCount == allcheckboxes.length ? "all" : checkCount
                })
            })
        }

        // Show or hide full filter menu
        filter.querySelector(".filter-title").addEventListener("click", function() { 
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

document.addEventListener("click", function(e) {
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



let form = document.getElementById("filters-form")
let filtersInputs = form.querySelectorAll("input[type='checkbox'], input[type='radio']")

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault()
    })
}

if (filtersInputs) {
    filtersInputs.forEach(input => {
        input.addEventListener("change", function() {
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
    let filters = { "filter-list": [], "sort-by": [] }
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

function removeFromCart(item, quantity = 1) {
    item.quantity = quantity < 0 ? 0 : item.quantity - quantity;
    if (item.quantity <= 0) {
        cart = cart.filter(element => element !== item)
        saveToLocal()
        return true
    }
    saveToLocal()
    return false
}

function emptyCart() {
    cart = []
    saveToLocal()
    updateQuickCart()    
}

function reloadCart() {
    let parentdiv = document.querySelector("aside .cart-articles-ctn")
    parentdiv.innerHTML = ""
    cart.forEach(item => generateCartItem(item))
}
reloadCart()
function generateCartItem(cartItem) {
    if (!cartItem) {
        return
    }
    let parentdiv = document.querySelector("aside .cart-articles-ctn")
    if (cart.length == 1) {
        parentdiv.innerHTML = ""
    }
    let container = document.createElement("div"); container.classList.add("cart-article-item");
    container.innerHTML = `
    <div class="cart-article-item" dataid='${cartItem.item_id}' datasize='${cartItem.size}'>
            <div class="left"><img src="${url}${cartItem.item_info.image}"></div>
            <div class="right">
                <div class="cart-item-header">
                <span class="cart-item-title">${cartItem.item_info.title}</span>
                <div class="bin-logo"><i class="fa-solid fa-trash-can"></i></div>
                </div>
                <div class="cart-item-price price">${generateCartItemPrice(cartItem)}</div>
                <div class="cart-item-info">
                    <span class="info-size"><span>Size: </span>${cartItem.size}</span>
                    <span class="info-size"><span>Color: </span>${cartItem.item_info.color}</span>
                </div>
                <div class="cart-item-quantity">
                    <span>Quantity: </span>
                    <div class="qty-select">
                        <div class="remove-item"><i class="fa-regular fa-square-minus"></i></div>
                        <div class="qty">${cartItem.quantity}</div>
                        <div class="add-item"><i class="fa-regular fa-square-plus"></i></div>
                    </div>
            </div>
        </div>`
        container.querySelector(".bin-logo").addEventListener("click", function () {
            removeFromCart(cartItem, -1)
            updateCartItemDiv(container, cartItem)
        })
        container.querySelector(".remove-item").addEventListener("click", function () {
            removeFromCart(cartItem)
            updateCartItemDiv(container, cartItem)
        })
        container.querySelector(".add-item").addEventListener("click", function () {
            addToExistingCart(cartItem, 1)
            updateCartItemDiv(container, cartItem)
        })
    parentdiv.appendChild(container);
}

function updateCartItemDiv(container, item) {
    if (!container) {
        return;
    }
    if (!item.quantity) {
        container.remove();
        updateQuickCart()
        return;
    }
    container.querySelector(".qty").innerHTML = item.quantity;

    updateQuickCart()
}

function updateQuickCart() {
    let container = document.querySelector("aside .cart-articles-ctn")
    if (cart.length == 0) {
        container.innerHTML = `
        <div class="empty">Le panier est vide !</div>`
    }
    updateCartPrice()
}
updateQuickCart()

document.querySelector(".nav-link.cart").addEventListener("click", function() {
    document.querySelector("aside").classList.toggle("visible")
})

// Removes the visible attribute when resizing over the max size of 
// the burger menu.
window.addEventListener("resize", function() {
    document.querySelector("aside").classList.remove("visible")
})


function updateCartPrice() {
    let fullPrice = 0;
    let loweredPrice = 0;
    cart.forEach(item => {
        if (item.quantity < 0) {
            return
        }
        fullPrice += item.quantity * item.item_info.price
        loweredPrice += item.quantity * (item.item_info.price - (item.item_info.price * item.item_info.reduction / 100))
    })

    document.querySelector(".total").innerHTML = 
        fullPrice != loweredPrice ?
            `<span class="new">${addZeros(loweredPrice)}€</span><span class="former">${addZeros(fullPrice)}€</span>`
            : `${addZeros(fullPrice)}€`
}

function generateCartItemPrice(cartItem) {
    let loweredPrice = cartItem.item_info.price - (cartItem.item_info.price * cartItem.item_info.reduction / 100)
    return loweredPrice != cartItem.item_info.price ? 
        `<span class="new">${addZeros(loweredPrice)}€</span><span class="former">${addZeros(cartItem.item_info.price)}€</span>`
        : `${addZeros(cartItem.item_info.price)}€`
    
}