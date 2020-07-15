let pageSize = 20
let catelogy = ''
let keyWord = ''
const apiKey = 'e65d651066b04c3db78dc9e47be77573'

document.getElementById('inputSearch').addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("btnSeach").click();
    }
});

const initialize = () => {
    console.log('initialize')
    pageSize = 20
    catelogy = ''
    keyWord = ''
}

const callApi = async () => {
    let url = `http://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&apiKey=${apiKey}`
    console.log('catelogy:', catelogy)
    if (catelogy > '' && keyWord > '') {
        url = `http://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&category=${catelogy}&q=${keyWord}&apiKey=${apiKey}`
    } else if (catelogy > '') {
        url = `http://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&category=${catelogy}&apiKey=${apiKey}`
    } else if (keyWord > '') {
        url = `http://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&q=${keyWord}&apiKey=${apiKey}`
    }
    console.log('url:', url)
    let data = await fetch(url)
    let result = await data.json();
    console.log('result:', result)
    render(result.articles)
}

const render = (list) => {
    let newsHTML = list.reduce((total, item) => {
        if (item.urlToImage == null) item.urlToImage = ''
        return total += `<div class="card mb-3">
        <div class="row no-gutters">
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title"><a href="${item.url}">${item.title}</a></h5>
                    <p class="card-text"><i class="fas fa-pen-fancy"></i><small class="text-muted">${item.author}</small></p>
                    <p class="card-text"><i class="fas fa-newspaper"></i><a href="${item.url}">${item.description}</a></p>
                    <p class="card-text"><i class="far fa-clock"></i><small class="text-muted">${moment(item.publishedAt).fromNow()}</small></p>
                </div>
            </div>
            <div class="col-md-4 rounded p-3">
            <a href="${item.url}"><img src="${item.urlToImage}"
                    class="card-img" alt="..."></a>
            </div>
        </div>
    </div>`
    }, '')
    document.getElementById('listNewsArea').innerHTML = newsHTML
}

const searchCatelogy = (name) => {
    console.log('searchCatelogy')
    let key = document.getElementById('inputSearch').value
    console.log('key:', key)
    initialize()
    catelogy = name;
    callApi()
}

const searchKeyWord = () => {
    console.log('searchKeyWord')
    let key = document.getElementById('inputSearch').value
    console.log('key:', key)
    if (key > '') {
        keyWord = key
        pageSize = 20
        callApi()
    }
}

const loadMore = () => {
    pageSize += 20;
    callApi(catelogy)
}

callApi()