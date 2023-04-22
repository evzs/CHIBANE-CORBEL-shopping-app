let userCart = []
const url = "http://localhost:5501/items"
let data = await getAllItems();

// document.querySelector("#test").addEventListener("click", function () {
//     document.querySelector("#another-test").innerHTML = "Ratio"
// })



async function getAllItems() {
    try {
        let response = await fetch(url)
        return await response.json();
    } catch (error) {
        console.log(error)
    }
}
async function logAllItems() {
    data.items.forEach(item => {
        let div = document.createElement("div")
        div.classList.add("merch-item")
        console.log(item)
        div.innerHTML = `
        <div class="merch-img">
            <div class="img front">${item.color.name} front</div>
            <div class="img back">${item.color.name} back</div>
            <div class="quick-cart ${Object.keys(item.sizes).length > 1 ? 'multiple' : 'single'}">
                <div>
                    <label class="cart" for="quick-add"><i class="fa-solid fa-cart-plus"></i></label>
                    <input id="quick-add" type="submit" class="hidden">
                </div>
                <div class="sizes-ctn">${getAllSizes(item)}</div>
            </div>
        </div>
        <div class="merch-details">
            <div class="title">${item.name} - ${item.color.name}</div>
            <div class="price-ctn"><span class="price">${item.price}</span>€</div>
            <div class="color-ctn"></div>
        </div>`
        items.forEach((variant, index) => {
            let colorDiv = document.createElement("div"); colorDiv.classList.add("color")
            colorDiv.innerHTML = `
                <input id="${item.id}-${index}" type="radio" class="hidden" name="item-${item.id}" value="${index}" ${index == 0 ? "checked" : ""}>
                <label for="${item.id}-${index}" style="background: ${variant.color.code}"> </label>
            `
            let input = colorDiv.querySelector("input")
            input.addEventListener("click", function () {
                div.querySelector(".title").innerHTML = `${item.variants[input.value].name} - ${item.variants[input.value].color.name}`
                div.querySelector(".price").innerHTML = item.variants[input.value].price
                div.querySelector(".front").innerHTML = `${item.variants[input.value].color.name} front`
                div.querySelector(".back").innerHTML = `${item.variants[input.value].color.name} back`
                div.querySelector(".sizes-ctn").innerHTML = getAllSizes(item.variants[input.value])
            })
            div.querySelector(".color-ctn").appendChild(colorDiv)
        })
        document.querySelector(".merch-item-ctn").appendChild(div)
    })
}
logAllItems()

function getAllSizes(item) {
    let newStr = "";
    Object.keys(item.sizes).forEach(latest => {
        if (item.sizes[latest]) {
            newStr += `
            <span class="size-block" data=${latest}>
                <input class="hidden" id="item-sizes-${item.id}-${latest}" type="radio" name="item-sizes-${item.id}" value="${item.sizes[latest]}">
                <label for="item-sizes-${item.id}-${latest}" class='size available'>${latest}</label>
            </span>`
            return
        }
            newStr+= (`<span data=${latest}" class='size not-available'>${latest}</span>`)
    })
    return newStr
}

function addToCart(baseItemID, variantID, size, quantity) {

    // let item;
    // try {
    //     item = data.items[baseItemID]
    // }
    // userCart.push({id})
} 

