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
        let catCtn = document.createElement("div");
        catCtn.classList.add("category-ctn")
        let catTitle = document.createElement("div");
        catTitle.classList.add("cat-title");
        catTitle.innerHTML = `${category.name}`
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
    let subcatContainer = document.createElement("div");
    subcatContainer.classList.add("subcat-ctn")
    category.subcategories.forEach(subcategory => {
        let subcatTitle = document.createElement("div");
        subcatTitle.classList.add("subcat-title");
        subcatTitle.innerHTML = `${subcategory.name}`
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
    itemDiv.classList.add("article-item")
    itemDiv.innerHTML = `
    <div class="article-img">
        <img class="first" src="${url}${item.images[0]}">
        <img class="second" src="${url}${item.images[1]}">
        ${item.reduction ? '<div class="reduction">-'+item.reduction+'%</div>' : ''}
    </div>
    <div class="article-info">
        <div class="brand">${item.brand}</div>
        <div class="name">${item.title}</div>
        <div class="price-see-more">
            ${generatePrice(item)}
            <a href="article.html?articleID=${item.id}" target="_blank" class="see-more">See more >></a>
        </div>
    </div>`
    container.appendChild(itemDiv)
}

function generatePrice(item) {
    return item.reduction ?
        `<div class="price"><span class="new">${addZeros(item.price - (item.price * item.reduction /100))}€</span><span class="former">${addZeros(item.price)}€</span></div>` :
        `<div class="price">${addZeros(item.price)}€</div>`

}
getArticles()

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
    let $target = $(e.target)

    if ($target.parents(".filter-options-container").length > 0 ||
        $target.hasClass("filter-options-container") ||
        $target.parents(".filter-title.activable").length > 0 ||
        $target.hasClass("filter-title activable")) {
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
    switch (filters["sort-by"]) {
        case "price-low":
            items.sort((a, b) => {
                return (a.price - (a.price * a.reduction / 100)) - (b.price - (b.price * b.reduction / 100))
            })
            break;
        case "price-high":
            items.sort((a, b) => {
                return (b.price - (b.price * b.reduction / 100)) - (a.price - (a.price * a.reduction / 100))
            })
            break;
        case "sale":
            items.sort((a, b) => {
                if (b - a == 0) {
                    return (b.price - (b.price * b.reduction / 100)) - (a.price - (a.price * a.reduction / 100))
                }
                return (b.reduction - a.reduction)
            })
            break;
        case "default":
            items.sort((a, b) => {
                return (b.id - a.id)
            })
            break;
    }
    return items
}


function retrieveFilters() {
    let filters = {
        "filter-list": [],
        "sort-by": []
    }
    let sortValue = document.querySelector("input[name='sort-by']:checked").value;

    filters["sort-by"] = sortValue ? sortValue : "no-sort";
    filters["filter-list"] = ALL_FILTERS.map(filter => {
        temp = {};
        return temp[filter] = Array.from(document.querySelectorAll(`input[name='${filter}']:checked`), e => e.value)
    })
    return filters
}