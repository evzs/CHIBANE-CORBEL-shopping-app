let userCart = []
const url = "http://localhost:5501/"
let data = await getAllItems();

async function getAllItems() {
    try {
        let response = await fetch(url + "items/")
        return await response.json();
    } catch (error) {
        console.log(error)
    }
}

function getAllSizes(item) {
    let newStr = "";
    Object.keys(item.sizes).forEach(latest => {
        if (item.sizes[latest]) {
            newStr += `
            <span class="size-block" data=${latest}>
                <input class="hidden size-data" id="item-sizes-${item.id}-${latest}" type="radio" name="item-sizes-${item.id}" value="${latest}">
                <label for="item-sizes-${item.id}-${latest}" class='size available'>${latest}</label>
            </span>`
            return
        }
            newStr+= (`<span data=${latest}" class='size not-available'>${latest}</span>`)
    })
    return newStr
}

function generateBaseItem(item) {
    let parentDiv = document.querySelector(".merch-item-ctn")
    let div = document.createElement("div")
    div.classList.add("merch-item")
    div.innerHTML = `
    <div class="merch-img">
        <div class="img front">${item.color.name} front</div>
        <div class="img back">${item.color.name} back</div>
        <form class="quick-cart ${Object.keys(item.sizes).length > 1 ? 'multiple' : 'single'}">
            <div>
                <label class="cart" for="quick-add"><i class="fa-solid fa-cart-plus"></i></label>
                <input type="hidden" class="item-data" value="${item.id}">
                <input id="quick-add" type="submit" class="hidden">
            </div>
            <div class="sizes-ctn">${getAllSizes(item)}</div>
        </form>
    </div>
    <div class="merch-details">
        <a href="">
        <div>
            <div class="title">${item.title} - ${item.color.name}</div>
            <div class="price-ctn"><span class="price">${item.price}</span>€</div>
        </div>
        <div class="see-more">
            <i class="fa-solid fa-angles-right"></i>
        </div>
        </a>
        
    </div>`
    parentDiv.appendChild(div)
}

function generateItems(itemList) {
    itemList.forEach(item => {
        generateBaseItem(item)
    })
}

generateItems(data.items)

let element = document.querySelector("form")
element.addEventListener("submit", function (e) {
    e.preventDefault()
    let table = element.querySelectorAll(".size-data")
    let size = Array.from(table).find(prout => prout.checked)
    !size ?
        console.log("invalid") : console.log(size.value)
    
})