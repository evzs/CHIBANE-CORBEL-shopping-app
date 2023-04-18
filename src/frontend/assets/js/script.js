document.querySelector("#test").addEventListener("click", function () {
    document.querySelector("#another-test").innerHTML = "Ratio"
})

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
        console.log(item)
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