let userCart = []
const url = "http://localhost:5501/"
let data = await makeRequest("items/");

async function makeRequest(endURL) {
    try {
        let response = await fetch(url + endURL)
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
    document.querySelector(".merch-item-ctn").innerHTML = "";
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

async function loadCategories() {
    let parentDiv = document.querySelector(".categories")
    let data = await makeRequest("categories/")
    if (!data || !data.categories) {
        return
    }
    
    document.querySelector(".show-all").addEventListener("click", function () {
        updateItems()
        selectCategory(this)
    })

    data.categories.forEach(category => {
        let catDiv = document.createElement("div"); catDiv.classList.add("category-ctn")
        let catTitle = document.createElement("div"); catTitle.classList.add("cat-title"); catTitle.innerHTML = `${category.name}`
        catTitle.addEventListener("click", function () {
            selectCategory(catTitle)
            updateItems(category.id)
        })
        catDiv.appendChild(catTitle);
        let subcat = generateSubCategories(category, catTitle)
        if (subcat) {
            catDiv.appendChild(subcat)
        }
        parentDiv.appendChild(catDiv)
    })
} 

function generateSubCategories(category, parentDiv) {
    if (!category.subcategories) {
        return
    }
    let subCtn = document.createElement("div"); subCtn.classList.add("subcategory-ctn")
    category.subcategories.forEach(subcategory => {
        let subcatTitle = document.createElement("div"); subcatTitle.classList.add("cat-title"); subcatTitle.innerHTML = `${subcategory.name}`
        subcatTitle.addEventListener("click", function () {
            selectCategory(parentDiv, subcatTitle)
            updateItems(category.id, subcategory.id)
        })
        subCtn.appendChild(subcatTitle)
    })
    return subCtn
}

loadCategories()

function selectCategory(catTitle, subcatTitle = null) {
    document.querySelectorAll(".cat-title,.subcat-title").forEach(div => {
        div.classList.remove("selected")
    })
    catTitle.classList.add("selected")
    if (subcatTitle) (
        subcatTitle.classList.add("selected")
    )
}

async function updateItems(catID=-1, subcatID=-1) {
    let data;
    if (catID < 0) {
        data = await makeRequest("items/");
    } else if (subcatID < 0) {
        data = await makeRequest(`items/category/${catID}`)
    } else {
        data = await makeRequest(`items/category/${catID}/${subcatID}`)
    }
    if (!data || !data.items) {
        return
    }
    console.log(data)
    generateItems(data.items)
} 