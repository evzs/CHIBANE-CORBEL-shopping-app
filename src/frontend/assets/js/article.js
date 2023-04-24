const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let articleID = params.articleID;
const url = "http://localhost:5501/"

if (!articleID) {
  document.querySelector("main").innerHTML = 404
}

function loadArticle(id) {
    fetch(url + `item/${id}`)
    .then(response => response.json())
    .then(response => {
        if (!response || !response.item) {
            document.querySelector("main").innerHTML = 404
            return
        }
        document.querySelector("main").innerHTML = `${response.item.title} - ${response.item.color.name}`
        return response.item
    })
    .catch(error => {
        console.log(`Error while fetching url: ${error}`)
        document.querySelector("main").innerHTML = 404
    })
}
loadArticle(articleID)
// let data = await getItemByID(articleID)
// if (!data.item) {
//   console.log("404 2")
// }