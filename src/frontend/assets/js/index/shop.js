//! MAIN PAGE SCRIPT: ARTICLES

// Retrieves the articles from a given API endpoint, apply filters if necessary
// and launches the HTML generating functions.
function getArticles(endpoint = "", filters = {}) {
    fetch(URL + `items/${endpoint}`)
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
        .catch(error => console.log(`Error while fetching URL: ${error}`))
}

// Function generating the HTML code for the article display on the main page.
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

// Sub-function to `generateArticles`, generating the HTML code for a single article block.
function generateBaseItem(item, container) {
    let itemDiv = document.createElement("div")
    itemDiv.classList.add("article-item");
    itemDiv.innerHTML = `
    <div class="article-img">
        <img class="first" src="${URL}${item.images[0]}">
        <img class="second" src="${URL}${item.images[1]}">
        <div class="quick-cart">
            <div class="choose-size">Choose your size:</div>
            <div class="sizes-container"></div>
        </div>
        ${item.reduction ? '<div class="reduction">-'+item.reduction+'%</div>' : ''}
    </div>
    <div class="article-info">
        <div class="article-brand">${item.brand}</div>
        <div class="article-name">${item.title} - ${item.color.name}</div>
        <div class="price-see-more">
            <div class="price">${generatePrice(item)}</div>
            <a href="article.html?articleID=${item.id}" target="_blank" class="see-more">See more >></a>
        </div>

    </div>`
    container.appendChild(itemDiv)
    generateQuickCart(item, itemDiv)
}
getArticles()


function updateItems(catID = -1, subcatID = -1, filters = []) {
    if (catID < 0) {
        getArticles("", filters)
    } else if (subcatID < 0) {
        getArticles(`category/${catID}`, filters)
    } else {
        getArticles(`category/${catID}/${subcatID}`, filters)
    }
}

//! MAIN PAGE SCRIPT: FILTERS
