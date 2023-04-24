const url = "http://localhost:5501/"
let data;

// *---- CATEGORIES --- //

function loadCategories() {
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
            selectCategory(catContainer, subcatTitle)
            changeTitle(category.name, subcategory.name)
            updateItems(category.id, subcategory.id)
        })
        subcatContainer.appendChild(subcatTitle)
    })
    return subcatContainer
}

loadCategories()

// *------------------- //

// *----- ARTICLES ---- //

function loadArticles(endpoint = "") {
    fetch(url + `items/${endpoint}`)
    .then(response => response.json())
        .then(response => {
        if (!response || !response.items) {
            return
        }
        generateArticles(response.items)
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
    items.forEach(item => generateBaseItem(item, container))
}

function generateBaseItem(item, containerDiv) {
    let itemDiv = document.createElement("div")
    itemDiv.classList.add("article-item")
    itemDiv.innerHTML = `
    <div class="article-img">
        <img class="first" src="${url}${item.images[0]}">
        <img class="second" src="${url}${item.images[1]}">
        ${item.reduction ? '<div class="reduction">-'+item.reduction+'%</div>' : ''}
    </div>
    <div class="article-info">
        <div class="brand">${item.cat}</div>
        <div class="name">${item.title}</div>
        <div class="price-see-more">
            ${generatePrice(item.price, item.reduction)}
            <a href="article.html?articleID=${item.id}" target="_blank" class="see-more">See more >></a>
        </div>
    </div>`
    containerDiv.appendChild(itemDiv)
}

function generatePrice(basePrice, reduction) {
    return reduction ?
        `<div class="price"><span class="new">${addZeros(basePrice - (basePrice * reduction /100))}€</span><span class="former">${addZeros(basePrice)}€</span></div>`
        : `<div class="price">${addZeros(basePrice)}€</div>`

} 
loadArticles()

function addZeros(number) {
    number = Number(number)
    if (isNaN(number)) {
        return 0
    }
    return number.toLocaleString("en",{useGrouping: false,minimumFractionDigits: 2});
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