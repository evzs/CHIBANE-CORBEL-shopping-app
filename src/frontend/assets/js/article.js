const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

let articleID = params.articleID;
let articleImgCount = 3;
let selectedQuantity = 1;

function truncateDescription(description, maxLength) {
    if (description.length <= maxLength) {
        return description;
    }
    return description.slice(0, maxLength) + "...";
}

// function revealFullDescription(button) {
//     const descriptionElement = button.parentNode.querySelector('.description');
//     const fullDescription = descriptionElement.dataset.fullDescription;
//     descriptionElement.textContent = fullDescription;
//     button.style.display = 'none';
// }

function generateSizeOptions(sizes) {
    let optionsHTML = "";
    for (const size in sizes) {
        optionsHTML += `<span class="size-option">${size}</span>`;
    }
    return optionsHTML;
}

function generateSwiperSlides(images) {
    let slideHTML = "";
    images.forEach((image, index) => {
        slideHTML += `<div class="swiper-slide" data-index="${index}"><img src="${URL}${image}" alt="Image" class="main-image"></div>`;
    });
    return slideHTML;
}

function generateArticle(item) {
    let articleDiv = document.createElement("section");
    articleDiv.className = "article";
    articleDiv.innerHTML = `
      <div class="swiper-container">
            <div class="swiper swiper_main">
                <div class="swiper-wrapper">
                    ${generateSwiperSlides(item.images)}
                </div>
            </div>
            <div class="swiper swiper_thumbnail">
                <div class="swiper-wrapper">
                    ${generateSwiperSlides(item.images)}
                </div>
            </div>
        </div>
        <div class="article-info">
            <div class="shop-header">
                <div class="sub">${item.category} > ${item.subcategory}</div>
                <h1>${item.title}</h1>
            </div>
            <div class="article-color"><span class="code" style="background-color: ${item.color.code};"></span> <span class="color-name">${item.color.name}</span></div>
            <div class="name price">${generatePrice(item)}</div>
            <div class="sizes">Sizes: ${generateSizeOptions(item.sizes)}</div>

            <div class="article-cart-ctn"></div>

            <!-- TODO: Size selection -->

            <!-- TODO: Add to cart -->

            <!-- TODO: Quantity picking -->
            ${item.reduction ? '<div class="singlepage-reduction">-'+item.reduction+'%</div>' : ''}
            <div class="description short" data-full-description="${item.description}">
                <div class="description-decoration">DESCRIPTION</div>
                <div class="display-decoration">>> Show more... <<</div>
                <span class="description-text">${truncateDescription(item.description, 150)}</span>
            </div>
            </div>
        <!-- TODO: Fake star reviews placeholder (maybe)-->
        <!-- TODO: Fake favorite placeholder (maybe)-->
    `;

    generateCartForm(item, articleDiv.querySelector(".article-cart-ctn"))
    document.querySelector("main").appendChild(articleDiv);
    document.querySelector(".description").addEventListener("click", function () {
        toggleDescription(item, 150)
    })
    const swiper_thumbnail = new Swiper(".swiper_thumbnail", {
        slidesPerView: 3,
        spaceBetween: 10,
        centerInsufficientSlides: true,
    });

    new Swiper(".swiper_main", {
        loop: true,
        autoplay: false,
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
        thumbs: {
            swiper: swiper_thumbnail,
        },
    });

    return articleDiv;
}

function loadArticle(id) {
    fetch(URL + `item/${id}`)
        .then((response) => response.json())
        .then((response) => {
            if (!response || !response.item) {
                document.querySelector("main").innerHTML = 404;
                return;
            }
            generateArticle(response.item);
        })
        .catch((error) => {
            console.log(`Error while fetching url: ${error}`);
            document.querySelector("main").innerHTML = 404;
        });
    
}
if (!articleID) {
    document.querySelector("main").innerHTML = 404;
} else {
    loadArticle(articleID);
    console.log(articleImgCount)
}

function toggleDescription(item, length) {
    let descriptionDiv = document.querySelector(".description");
    let textDiv = descriptionDiv.querySelector(".description-text")
    if (!descriptionDiv || !item.description) {
        return
    }
    descriptionDiv.classList.toggle("short")
    if (descriptionDiv.classList.contains("short")) {
        textDiv.innerHTML = truncateDescription(item.description, length)
        descriptionDiv.querySelector(".display-decoration").innerHTML = ">> Show more... <<"
    } else {
        descriptionDiv.querySelector(".display-decoration").innerHTML = ">> Show less <<"
        textDiv.innerHTML = `
        ${item.description}
        <div class="infos">
            <div class="info">
                <span class="title">Featured Cat:</span><span class="content">${item.brand}</span>
            </div>
            <div class="info">
                <span class="title">Color:</span><span class="content">${item.color.name}</span>
            </div>
        </div>
        
        `
    }
}

function generateCartForm(item, parentdiv) {
    if (!parentdiv || !item) {
        return
    }
    parentdiv.innerHTML = `
    <div class="select-attr-ctn">
        <div class="attr-item">
            <div class="title">SELECT A SIZE</div>
            <div class="sizes-ctn">
                ${generateArticleSizes(item)}               
            </div>
        </div>
        <div class="attr-item">
            <div class="title">SELECT A QUANTITY</div>
            <div class="quantity-ctn">
                <div class="art-remove-item"><i class="fa-regular fa-square-minus"></i></div>
                <div class="item-qty qty">1</div>
                <div class="art-add-item"><i class="fa-regular fa-square-plus"></i></div>
            </div>
        </div>
    </div>
    <div class="purchase-btn add-to-cart">Add to cart</div>
    `
    parentdiv.querySelector(".art-add-item").addEventListener("click", function () {
        updateSelectedQuantity(1)
    })
    parentdiv.querySelector(".art-remove-item").addEventListener("click", function () {
        updateSelectedQuantity(-1)
    })
    parentdiv.querySelector(".add-to-cart").addEventListener("click", function () {
        let size = document.querySelector("input[name='size']:checked")?.value
        if (!size || !item.sizes[size]) {
            console.warn("doesnt exist ?")
            return
        }
        addToCart(item, size, selectedQuantity)
    })
}


function generateArticleSizes(item) {
    let result = ``
    Array.from(Object.keys(item.sizes)).forEach(size => {
        result += (item.sizes[size]) ?
            `<div class="size available">
                <input name="size" id="size-${size}" type="radio" class="hidden" value="${size}">
                <label for="size-${size}">${size}</label>
            </div>`:
            `<div class="size not-available">${size}</div>`
            
    })
    console.log(result)
    return result;
}

function updateSelectedQuantity(number) {
    selectedQuantity += number
    if (selectedQuantity > 10) {
        selectedQuantity = 10
    } else if (selectedQuantity <= 0) {
        selectedQuantity = 1
    }
    document.querySelector(".item-qty").innerHTML = selectedQuantity
}