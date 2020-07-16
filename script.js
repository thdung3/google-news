let pageSize = 20
let catelogy = ''
let keyWord = ''
const apiKey = 'e65d651066b04c3db78dc9e47be77573'
let source = {}
let arrayResult = []
let keySources = []

const initialize = () => {
    console.log('initialize')
    pageSize = 20
    catelogy = ''
    keyWord = ''
}

const callApi = async () => {
    let url = `http://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&apiKey=${apiKey}`
    if (catelogy > '') {
        url = `http://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&category=${catelogy}&apiKey=${apiKey}`
    }
    if (keyWord > '') {
        url = `http://newsapi.org/v2/everything?pageSize=${pageSize}&q=${keyWord}&apiKey=${apiKey}`
    }
    console.log('url:', url)
    let data = await fetch(url)
    let result = await data.json();
    source = {}
    arrayResult = result.articles
    console.log('arrayResult:', arrayResult)
    arrayResult.map(item => {
        if (item.source.name != null) {
            if (item.source.name in source) {
                source[item.source.name]++
            } else {
                source[item.source.name] = 1
            }
        }
    })
    keySources = Object.keys(source)
    render(arrayResult)
    renderSource()
}

const render = (arrayList) => {
    let newsHTML = arrayList.reduce((total, item) => {
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

const renderSource = () => {
    let sourceHTML = keySources.reduce((total, item) => {
        return total += `<div class="group">
            <input type="checkbox" onchange="searchSource()">
            <span>${item}(${source[item]})<span>
        </div>`
    }, '')
    document.getElementById('sources-item').innerHTML = sourceHTML
}

const searchSource = () => {
    console.log('---- searchSource ----')
    let checkBoxes = document.getElementById('sources-item').getElementsByTagName('input')
    let arrayFiltered = arrayResult.filter(item => {
        for (let i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                console.log('keySources[i]:', keySources[i])
                if (item.source.name == keySources[i]) return item.source.name
            }
        }
    })
    console.log('arrayFiltered:', arrayFiltered)
    if (arrayFiltered.length === 0) {
        arrayFiltered = arrayResult;
    }
    render(arrayFiltered)
}

const searchCatelogy = (name) => {
    console.log('---- searchCatelogy ----')
    let key = document.getElementById('inputSearch').value
    console.log('key:', key)
    initialize()
    catelogy = name;
    callApi()
}

const searchKeyWord = () => {
    console.log('---- searchKeyWord ----')
    let key = document.getElementById('inputSearch').value
    console.log('key:', key)
    if (key > '') {
        keyWord = key
        pageSize = 20
        document.getElementById('inputSearch').value = ''
        callApi()
    }
}

const loadMore = () => {
    pageSize += 20;
    callApi(catelogy)
}

callApi()

document.getElementById('inputSearch').addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("btnSeach").click();
    }
});