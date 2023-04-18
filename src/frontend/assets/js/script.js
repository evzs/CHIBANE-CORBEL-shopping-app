// document.querySelector("#test").addEventListener("click", function () {
//     document.querySelector("#another-test").innerHTML = "Ratio"
// })

const url = "http://localhost:5501/"

async function getAllItems() {
    try {
        let response = await fetch(url)
        return await response.json();
    } catch (error) {
        console.log(error)
    }
}
async function logAllItems() {
    let data = await getAllItems();
    data.items.forEach(item => {
        let div = document.createElement("div")
        div.classList.add("merch-item")
        div.innerHTML = `
        <div class="merch-img"></div>
        <div class="merch-details">
            <div class="title">${item[0].title}</div>
            <div class="price">${item[0].price}€</div>
            <div class="color-ctn"></div>
        </div>`
        item.forEach(variant => {
            div.querySelector(".color-ctn").innerHTML += `<div class="color" style="background: ${variant.color.code};"></div>`
        })
        document.querySelector(".merch-item-ctn").appendChild(div)
    })
}
logAllItems()

// Example de Alan:
// btn.addEventListener("click", onBtnClick)
// function onBtnClick() {
//     fetch(`${url}sneakers`)
//         .then(response => {
//             return response.json()
//         })
//         .then(response => {
//             console.log(response)
//         })
//         .catch(error => {
//             console.log(`Error while fetching url: ${error}`)
//         })
// }