// Retrieves the articles from a given API endpoint, apply filters if necessary
// and launches the HTML generating functions.
function getArticles(endpoint = "", filters = {}) {
    fetch(URL + `items/${endpoint}`)
        .then(response => response.json())
        .then(response => {
            // VIDE?
            if (!response || !response.items) {
            } else if (!Object.keys(filters).length) {
                generateArticles(response.items)
            } else {
                filteredItems = applyFilters(response.items, filters)
                generateArticles(filteredItems)
            }
            return response.items
        })
        .catch(error => console.log(`Error while fetching URL: ${error}`))
}

// Function generating the HTML code for the article display on the main page.
function generateArticles(items) {
    let container = document.querySelector(".articles-ctn")
    if (!container) {
        return
    }
    
    container.innerHTML = "";
    if (items.length) {
        items.forEach(item => generateBaseItem(item, container))
        container.classList.remove("empty")
    } else {
        container.classList.add("empty")
        container.innerHTML = `<div class="no-result">There's nothing to show !</div>`;
    }

}

// Sub-function to `generateArticles`, generating the HTML code for a single article block.
function generateBaseItem(item, container) {
    
    let itemDiv = document.createElement("div")
    itemDiv.classList.add("article-item");
    itemDiv.innerHTML = `
    <div class="article-img">
        <a href="article.html?articleID=${item.id}"><img class="first" src="${URL}${item.images[0]}">
        <img class="second" src="${URL}${item.images[1]}"></a>
        <div class="quick-cart">
            <div class="choose-size">Choose your size:</div>
            <div class="sizes-container"></div>
        </div>
        ${item.reduction ? '<div class="reduction">-'+item.reduction+'%</div>' : ''}
    </div>
    <a href="article.html?articleID=${item.id}">
    <div class="article-info">
        
        <div class="article-brand">${item.brand}</div>
        <div class="article-name">${item.title} - ${item.color.name}</div>
        <div class="price-see-more">
            <div class="price">${generatePrice(item)}</div>
            <span class="see-more">See more >></span>
        </div>
        
    </div>
    </a>`
    container.appendChild(itemDiv)
    generateQuickAdd(item, itemDiv)
}
getArticles()

// Updates the items based on the current category and subcategory.
function updateItems(catID = -1, subcatID = -1, filters = []) {
    
    if (catID < 0) {
        getArticles("", filters)
    } else if (subcatID < 0) {
        getArticles(`category/${catID}`, filters)
    } else {
        getArticles(`category/${catID}/${subcatID}`, filters)
    }
}

// Generates the option to quick add the item to the cart on the main page.
function generateQuickAdd(item, container) {
    if (!container.querySelector(".sizes-container")) {
        return
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
