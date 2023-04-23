console.log("JS successfully linked")

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let data;
let articleID = params.id;
const url = "http://localhost:5501/"

if (!articleID) {
  document.querySelector("#content").innerHTML = "404: invalid request"
}

async function getItemByID(id) {
    try {
        let response = await fetch(url + "item/" + id)
        return await response.json();
    } catch (error) {
        console.log(error)
    }
}

try {
    data = await getItemByID(articleID)
    document.querySelector("#content").innerHTML = `${data.items.title} - ${data.items.color.name}`
} catch {
    document.querySelector("#content").innerHTML = "404"
}

