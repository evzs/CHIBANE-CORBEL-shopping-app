// ?GLOBAL VARIABLES

let cart = []
const URL = "http://localhost:5501/"

// ?LOCAL STORAGE

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

// ?CART DROPDOWN

// Listener for the cart dropdown.
document.querySelector(".nav-link.cart").addEventListener("click", function() {
    document.querySelector("aside").classList.toggle("visible")
})

// Removes the visible attribute when resizing over the max size of 
// the burger menu.
window.addEventListener("resize", function() {
    document.querySelector("aside").classList.remove("visible")
})

// ?UTILITARY FUNCTIONS

// Cosmetic function adding 0s to a price (2€ = 2,00€)
function addZeros(number) {
    number = Number(number)
    if (isNaN(number)) {
        return 0
    }
    return number.toLocaleString("en", {
        useGrouping: false,
        minimumFractionDigits: 2
    });
}

function removeClassFromAll(divArr, className) {
    if (divArr.length == 0) {
        return
    }
    divArr.forEach(div => {
        div.classList.remove(className)
    })
}

function generatePrice(item) {
    return item.reduction ?
        `<span class="new">${addZeros(item.price - (item.price * item.reduction /100))}€</span><span class="former">${addZeros(item.price)}€</span>` :
        `${addZeros(item.price)}€`
}

//? CART
function addToCart(item, size, quantity = 1) {
    let existing = cart.find(i => i.item_id == item.id && i.size == size)
    if (existing) {
        existing.quantity += quantity;
        let existingDiv = document.querySelector(`[dataid='${item.id}'][datasize='${size}']`)
        updateCartItemInfo(existingDiv, existing)
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
    updateCartInfo()
}

function addToExistingItemInCart(item, quantity = 1) {
    item.quantity += quantity;
    saveToLocal()
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

// Adds function to "empty all" button in the cart.
document.querySelector(".empty-btn").addEventListener("click", function () {
    cart = []
    saveToLocal()
    updateCartInfo()
})

// Load the entire cart with all its items.
function reloadCart() {
    let parentdiv = document.querySelector("aside .cart-articles-ctn")
    parentdiv.innerHTML = ""
    cart.forEach(item => generateCartItem(item))
}
reloadCart()

// Generates the HTML code for a single item of the cart.
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
            <div class="left"><img src="${URL}${cartItem.item_info.image}"></div>
            <div class="right">
                <div class="cart-item-header">
                <span class="cart-item-title"><a target="blank_" href="article.html?articleID=${cartItem.item_id}">${cartItem.item_info.title}</span></a>
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
            updateCartItemInfo(container, cartItem)
        })
        container.querySelector(".remove-item").addEventListener("click", function () {
            removeFromCart(cartItem)
            updateCartItemInfo(container, cartItem)
        })
        container.querySelector(".add-item").addEventListener("click", function () {
            addToExistingItemInCart(cartItem, 1)
            updateCartItemInfo(container, cartItem)
        })
    parentdiv.appendChild(container);
}

// Generates the HTML for a single cart item price.
function generateCartItemPrice(cartItem) {
    let loweredPrice = cartItem.item_info.price - (cartItem.item_info.price * cartItem.item_info.reduction / 100)
    return loweredPrice != cartItem.item_info.price ? 
        `<span class="new">${addZeros(loweredPrice)}€</span><span class="former">${addZeros(cartItem.item_info.price)}€</span>`
        : `${addZeros(cartItem.item_info.price)}€`
}

// Updates the HTML code of an item in cart to match its 
// current quantity.
function updateCartItemInfo(container, item) {
    if (!container) {
        return;
    }
    if (!item.quantity) {
        container.remove();
        updateCartInfo()
        return;
    }
    container.querySelector(".qty").innerHTML = item.quantity;
    updateCartInfo()
}

// Updates the cart total price, displays a placeholder text 
// if the cart is empty.
function updateCartInfo() {
    let container = document.querySelector("aside .cart-articles-ctn")
    if (cart.length == 0) {
        container.innerHTML = `
        <div class="empty">Your shopping bag is empty !</div>`
        document.querySelector(".empty-cart").style.display = "none";
    } else {
        document.querySelector(".empty-cart").style.display = "flex";
    }
    updateCartPrice()
}
updateCartInfo()

// Updates the total price of the cart and the count tag right beside
// the cart icon.
function updateCartPrice() {
    let fullPrice = 0;
    let loweredPrice = 0;
    let qty = 0
    cart.forEach(item => {
        if (item.quantity < 0) {
            return
        }
        fullPrice += item.quantity * item.item_info.price
        loweredPrice += item.quantity * (item.item_info.price - (item.item_info.price * item.item_info.reduction / 100))
        qty += item.quantity
    })

    document.querySelector(".total").innerHTML = 
        fullPrice != loweredPrice ?
            `<span class="new">${addZeros(loweredPrice)}€</span><span class="former">${addZeros(fullPrice)}€</span>`
            : `${addZeros(fullPrice)}€`
    document.querySelector(".count").innerHTML = qty
    qty > 0 ?
        document.querySelector(".item-count").classList.add("visible") :
        document.querySelector(".item-count").classList.remove("visible")
}

