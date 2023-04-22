const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let articleID = params.id;
const url = "http://localhost:5501/"

if (!articleID) {
  console.log("404 1")
}

async function getItemByID(id) {
    try {
        let response = await fetch(url + "item/" + id)
        return await response.json();
    } catch (error) {
        console.log(error)
    }
}

let data = await getItemByID(articleID)
if (!data.item) {
  console.log("404 2")
}