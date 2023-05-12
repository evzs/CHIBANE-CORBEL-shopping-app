// ?GLOBAL VARIABLES
let currentCategory = -1;
let currentSubCategory = -1;

// ?CATEGORY DISPLAY

// Retrieves the categories from the API and launches the HTML generating function.
function getCategories() {
    fetch(URL + "categories/")
        .then(response => response.json())
        .then(response => {
            if (!response || !response.categories) {
                return
            }
            generateCategories(response.categories)
            return response.categories
        })
        .catch(error => console.log(`Error while fetching URL: ${error}`))
}

// Generates the HTML for the categories and calls the sub-category generating
// function for each.
function generateCategories(categories) {
    // Adds listener to the "Show all" link:
    document.querySelector(".show-all").addEventListener("click", function () {
        currentCategory = -1
        currentSubCategory = -1
        switchCategory(this)
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
            switchCategory(catTitle)
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

// Generates the HTML for all the subcategories of a given category.
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
            switchCategory(catContainer, subcatTitle)
            changeTitle(category.name, subcategory.name)
            updateItems(category.id, subcategory.id)
        })
        subcatContainer.appendChild(subcatTitle)
    })
    return subcatContainer
}

// Fires when the user clicks on another category title.
function switchCategory(catTitle, subcatTitle = null) {
    document.querySelectorAll(".cat-title,.subcat-title").forEach(div => {
        div.classList.remove("selected")
    })
    catTitle.classList.add("selected")
    if (subcatTitle) {
        subcatTitle.classList.add("selected")
    }
    unsetFilters()
}

// Changes the h1 title on the main page according to the current category.
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






getCategories()