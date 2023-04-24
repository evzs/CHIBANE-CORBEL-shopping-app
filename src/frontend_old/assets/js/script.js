let userCart = []
const url = "http://localhost:5501/"
let data;

// function makeRequest(endURL) {
//     try {
//         let response = fetch()
//         return response.json();
//     } catch (error) {
//         console.log(error)
//     }
// }

function makeRequest(endURL="") {
    fetch(url + endURL)
        .then(response => {
            return response.json()
        })
        .then(response => {
            data = response
            return response
        })
        .catch(error => {
            console.log(`Error while fetching url: ${error}`)
        })
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

function generateItems(endURL = "") {
    fetch(url + "items/" + endURL)
        .then(response =>  response.json())
        .then(response => {
            data = response
            document.querySelector(".merch-item-ctn").innerHTML = "";
            data.items.forEach(item => {
                generateBaseItem(item)
            })
            return response
        })
        .catch(error => {
            console.log(`Error while fetching url: ${error}`)
        })
}
generateItems()

function loadCategories() {
    let parentDiv = document.querySelector(".categories")

    fetch(url + "categories/")
    .then(response => {
        return response.json()
    })
    .then(response => {
        
        data = response
        if (!data || !data.categories) {
    return
    }
    


    data.categories.forEach(category => {
        let catCtn = document.createElement("div"); catCtn.classList.add("category-ctn")
        let catTitle = document.createElement("div"); catTitle.classList.add("cat-title"); catTitle.innerHTML = `${category.name}`
        catTitle.addEventListener("click", function () {
            selectCategory(catTitle)
            updateItems(category.id)
        })
        catCtn.appendChild(catTitle);
        let subcat = generateSubCategories(category, catTitle)
        if (subcat) {
            catCtn.appendChild(subcat)
        }
        parentDiv.appendChild(catCtn)
        })
    return response
    })
    .catch(error => {
        console.log(`Error while fetching url: ${error}`)
    })
} 

function generateCategories(categories) {
    // Adds listener to the "Show all" link:
    document.querySelector(".show-all").addEventListener("click", function () {
        // selectCategory(this)
        // updateItems()
        console.log("all")
    })

    let container = document.querySelector(".categories")
    if (!container || !categories) {
        return
    }

    categories.forEach(category => {
        let catCtn = document.createElement("div"); catCtn.classList.add("category-ctn")
        let catTitle = document.createElement("div"); catTitle.classList.add("cat-title"); catTitle.innerHTML = `${category.name}`
        catTitle.addEventListener("click", function () {
            // selectCategory(catTitle)
            // updateItems(category.id)
            console.log("cat")
        })
        catCtn.appendChild(catTitle);
        let subcatCtn = generateSubCategories(category, catTitle)
        if (subcatCtn) {
            catCtn.appendChild(subcatCtn)
        }
        parentDiv.appendChild(catCtn)
    })
}

function generateSubCategories(category, parentDiv) {
    if (!category.subcategories) {
        return
    }
    let subcatCtn = document.createElement("div"); subcatCtn.classList.add("subcategory-ctn")
    category.subcategories.forEach(subcategory => {
        let subcatTitle = document.createElement("div"); subcatTitle.classList.add("cat-title"); subcatTitle.innerHTML = `${subcategory.name}`
        subcatTitle.addEventListener("click", function () {
            // selectCategory(parentDiv, subcatTitle)
            // updateItems(category.id, subcategory.id)
            console.log("subcat")
        })
        subcatCtn.appendChild(subcatTitle)
    })
    return subcatCtn
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

function updateItems(catID=-1, subcatID=-1) {
    if (catID < 0) {
        loadArticles()
    } else if (subcatID < 0) {
        loadArticles(`category/${catID}`)
    } else {
       loadArticles(`category/${catID}/${subcatID}`)
    }
} 