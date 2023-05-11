const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

let articleID = params.articleID;
const url = "http://localhost:5501/";

if (!articleID) {
    document.querySelector("main").innerHTML = 404;
}

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

function generateArticle(item) {
    let articleDiv = document.createElement("div");
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
   <!-- <div class="article-info">
        <div class="brand">${item.brand}</div>
        <div class="name">${item.title}</div>
        <div class="price">${addZeros(item.price)}€</div>
    </div>
    <div class="description">${item.description}</div>
-->
  `;
    document.querySelector("main").appendChild(articleDiv);

    const swiper_thumbnail = new Swiper(".swiper_thumbnail", {
        slidesPerView: 3,
        spaceBetween: 10,
    });
    const swiper = new Swiper(".swiper_main", {
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
}

function generateSwiperSlides(images) {
    let slideHTML = "";
    images.forEach((image) => {
        slideHTML += `<div class="swiper-slide"><img src="${url}${image}" alt="Image"></div>`;
    });
    return slideHTML;
}

loadArticle(articleID);