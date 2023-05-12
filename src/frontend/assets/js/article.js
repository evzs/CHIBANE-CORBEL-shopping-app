const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

let articleID = params.articleID;
const url = "http://localhost:5501/";

function addZeros(number) {
    number = Number(number);
    if (isNaN(number)) {
        return 0;
    }
    return number.toLocaleString("en", {
        useGrouping: false,
        minimumFractionDigits: 2,
    });
}

function generatePrice(item) {
    return item.reduction ?
        `<div class="price"><span class="new">${addZeros(item.price - (item.price * item.reduction /100))}€</span><span class="former">${addZeros(item.price)}€</span></div>`
        : `<div class="price">${addZeros(item.price)}€</div>`

}

function truncateDescription(description, maxLength) {
    if (description.length <= maxLength) {
        return description;
    }
    return description.slice(0, maxLength) + "...";
}

function revealFullDescription(button) {
    const descriptionElement = button.parentNode.querySelector('.description');
    const fullDescription = descriptionElement.dataset.fullDescription;
    descriptionElement.textContent = fullDescription;
    button.style.display = 'none';
}

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
        slideHTML += `<div class="swiper-slide" data-index="${index}"><img src="${url}${image}" alt="Image" class="main-image"></div>`;
    });
    return slideHTML;
}

function generateArticle(item) {
    let articleDiv = document.createElement("div");
    articleDiv.className = "article";
    articleDiv.innerHTML = `
      <div class="swiper-container">
            <h1>${item.title} - ${item.color.name}</h1>
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
            <div class="brand">Featured cat : ${item.brand}</div>
            <div class="name">${item.title}</div>
            <div class="color"><span class="code" style="background-color: ${item.color.code}; border-radius: 50%; display: inline-block; width: 16px; height: 16px;"></span> ${item.color.name}</div>
            <!-- TODO: Color selection ??? -->
            <div class="sizes">Sizes: ${generateSizeOptions(item.sizes)}</div>
            <!-- TODO: Size selection -->
            <!-- TODO: Add to cart -->
            <!-- TODO: Quantity picking -->
            ${item.reduction ? '<div class="singlepage-reduction">-'+item.reduction+'%</div>' : ''}
            ${generatePrice(item)}
            <div class="description" data-full-description="${item.description}">${truncateDescription(item.description, 150)}</div>
            <button onclick="revealFullDescription(this)">En savoir plus...</button>
             <!-- TODO: Unreveal -->
        </div>
        <!-- TODO: Fake star reviews placeholder (maybe)-->
        <!-- TODO: Fake favorite placeholder (maybe)-->
    `;


    document.querySelector("main").appendChild(articleDiv);

    const swiper_thumbnail = new Swiper(".swiper_thumbnail", {
        slidesPerView: 3,
        spaceBetween: 10,
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
    fetch(url + `item/${id}`)
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
}
