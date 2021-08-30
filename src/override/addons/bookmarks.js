import { createElement } from '../utils.js'

export function loadBookmarks() {
    console.log(`loading bookmarks`)
    createElement("bookmarksContainer","", "#seshParent");
    getBookmarks()
}

function getBookmarks() {
    chrome.bookmarks.getTree(function(result) {
        console.log(`fetched bookmarks`, result)
        if(result && result[0]) {
            if(result[0].children) {
                let results = result[0].children
                const bookmarksBar = results.filter(item => (
                    item.title.toLowerCase() === 'Bookmarks bar'.toLowerCase() ||
                    item.title.toLowerCase() === 'Bookmarks'.toLowerCase())
                    )[0]

                let bookmarkSearch = createElement("bookmarkSearch", "bookmarkSearch", "#bookmarksContainer", "input")
                bookmarkSearch.setAttribute("placeholder", "search")
                createElement("searchContainer", "searchContainer", "#bookmarksContainer")

                bookmarkSearch.addEventListener('input', (event)=>searchBookmarks(event, bookmarksBar), false)
                if(typeof bookmarksBar !== 'undefined')
                    populateBookmarks(0, bookmarksBar.children)
            }
        }
    });
}

function searchBookmarks(event, bookmarks) {
    const value = event.target.value
    const searchContainer = document.querySelector("#searchContainer")
    let oldResults = document.querySelector("#searchResultsContainer")
    if(oldResults)
        oldResults.remove()

    if(value.trim() === '') {
        searchContainer.classList.remove("show")
        let bookmarkLevels = document.getElementsByClassName(`bookmarkLevel`)
        for (let i = 0; i < bookmarkLevels.length; i++) {
            bookmarkLevels[i].classList.remove('hide')
        }
        return
    }

    let bookmarkLevels = document.querySelectorAll(`.bookmarkLevel`)
    for (let i = 0; i < bookmarkLevels.length; i++) {
        bookmarkLevels[i].classList.add('hide')
    }

    const searchResults = recursiveSearch([], bookmarks, value.toLowerCase())
    searchContainer.classList.add("show")
    let searchEmptyDiv = document.querySelector("#searchEmpty")
    if(searchResults.length === 0) {
        //show no results div
        if(searchEmptyDiv)
            return
        let searchEmptyDiv = createElement("searchEmpty", "searchEmpty", "#searchContainer")
        searchEmpty.innerHTML = 'No results'
    }
    else {
        //hide search empty, show searchresults div
        if(searchEmptyDiv)
            searchEmptyDiv.remove()

        createElement("searchResultsContainer", "", "#searchContainer")

        searchResults.forEach(item => {
            let result = createElement("", "searchResult", "#searchResultsContainer")
            let resultTitle = createElement("", "resultTitle")
            resultTitle.innerHTML = trimText(item.title, 30)
            let resultLink = createElement("", "resultLink")
            resultLink.innerHTML = trimText(item.url, 50)
            result.appendChild(resultTitle)
            result.appendChild(resultLink)
            result.addEventListener('click', (event)=>clickSearchResult(event, item), false)
            result.addEventListener('dblclick', ()=>openLinks(item), false)
        });
    }
}

function clickSearchResult(event, item) {
    const searchResults = document.getElementsByClassName("searchResult")
    for(let i=0; i<searchResults.length; i++) {
        searchResults[i].classList.remove("active")
    }
    event.target.classList.add("active")
    updateStatusBar(item)
}

function recursiveSearch(list, bookmarks, value) {
    if(!bookmarks || (!bookmarks.url && (!bookmarks.children || bookmarks.children.length === 0))) {
        return list
    }
    if(bookmarks.url) {
        if(bookmarks.url.toLowerCase().includes(value) || bookmarks.title.toLowerCase().includes(value))
            return [...list, { title: bookmarks.title, url: bookmarks.url }]
        else
            return list
    }
    else {
        let newList= []
        bookmarks.children.forEach(item => {
            newList = recursiveSearch(newList, item, value)
        })
        return [...list, ...newList]
    }
}

function populateBookmarks(level, bookmarks) {
    for(let i=level; i<level+10; i++) {
        let oldBookmarksLevel = document.getElementById(`bookmarkLevel-${i}`)
        if(oldBookmarksLevel)
            oldBookmarksLevel.remove()
    }
    if(!bookmarks || bookmarks.length === 0)
        return

    createElement(`bookmarkLevel-${level}`, "bookmarkLevel", "#bookmarksContainer")
    
    bookmarks.forEach((item, index) => {
        let bookmarkItem = createElement(
            `bookmark-${item.title}`,
            `bookmarkItem ${item.url ? `link` : `folder`}`,
            `#bookmarkLevel-${level}`
        )
        
        let connectorLeft = createElement("", `connectorLeft connector-to-${level}`)
        bookmarkItem.appendChild(connectorLeft)

        let title = createElement("", `itemTitle itemTitle-${level}`)
        title.innerHTML = item.url ? trimText(item.title, 90) : trimText(item.title, 30)
        bookmarkItem.appendChild(title)

        let pinIcon = document.createElement("img")
        pinIcon.className = `pinIcon`
        pinIcon.src = 'assets/pin.svg'
        pinIcon.title = 'pin bookmark'
        bookmarkItem.appendChild(pinIcon)

        let connectorRight = createElement("", `connectorRight connector-from-${level}`)
        bookmarkItem.appendChild(connectorRight);

        let tooltip = document.createElement('div')
        tooltip.classList.add('tooltip')
        tooltip.innerHTML = item.url ? `Click to select,<br/>Double click to open link`
                                        : `Click to select,<br/>Double click to open all links,<br/>Right click to open random`
        bookmarkItem.appendChild(tooltip)

        bookmarkItem.addEventListener('click', (event)=>selectBookmark(event, level, item, index, true), false)
        bookmarkItem.addEventListener('dblclick', ()=>openLinks(item), false)
        bookmarkItem.addEventListener('contextmenu', (event)=>openRandomLink(event, item), false)
        pinIcon.addEventListener('click', (e) => {e.stopPropagation(); updatePinnedItems('add', item)})
    });
}

function trimText(text, limit) {
    return (text.length > limit) ? text.substring(0, limit) + '...' : text
}

function selectBookmark(event, level, item, index, shouldOpenNextLevel) {
    if(shouldOpenNextLevel) {
        populateBookmarks(level+1, item.children)
        updateStatusBar(item)
    }

    let rightConnectors = document.getElementsByClassName(`connector-from-${level}`)
    for (let i = 0; i < rightConnectors.length; i++) {
        rightConnectors[i].classList.remove('active')
    }
    let leftConnectors = document.getElementsByClassName(`connector-to-${level+1}`)
    for (let i = 0; i < leftConnectors.length; i++) {
        if(leftConnectors[i])
            leftConnectors[i].classList.add('active')
    }

    let titles = document.getElementsByClassName(`itemTitle-${level}`)
    for (let i = 0; i < titles.length; i++) {
        titles[i].classList.remove('active')
    }
    if(shouldOpenNextLevel)
        event.target.classList.add('active')
    if(!item.url)
        event.target.parentElement.querySelector('.connectorRight').classList.add('active')

    
    let connectorVertical = document.createElement("div")
    connectorVertical.className = `connectorVertical connector-on-${level}`
    const connectorHeight = item.children ? (index < item.children.length ? `${item.children.length*90 - 90}px` : '100%') : `0`
    connectorVertical.style.height = connectorHeight
    const nextLevel = document.getElementById(`bookmarkLevel-${level+1}`)
    if(nextLevel)
        nextLevel.appendChild(connectorVertical)
}

function updateStatusBar(item) {
    let oldStatusBar = document.getElementById("bookmarksStatusBar")
    if(oldStatusBar)
        oldStatusBar.remove()

    let itemDescription = document.createElement("div")
    let heading = document.createElement("div")
    let link = document.createElement("div")
    heading.className = "descriptionHeading"
    link.className="descriptionLink"
    itemDescription.className = "itemDescription"
    if(item.url) {
        heading.innerHTML = trimText(item.title, 200)
        link.innerHTML = trimText(item.url, 300)
        itemDescription.appendChild(heading)
        itemDescription.appendChild(link)
    }
    else {
        itemDescription.innerHTML = trimText(item.title, 90)
    }

    const bookmarksStatusBar = createElement("bookmarksStatusBar", "active", "#bookmarksContainer")
    bookmarksStatusBar.appendChild(itemDescription)
}

function openLinks(item) {
    if(item.url)
        window.open(item.url, "_blank")
    else
        item.children.forEach(child => openLinks(child))
}

function openRandomLink(event, item) {
    event.preventDefault()
    if(item.url)
        return
    else {
        let selected={}, counter = 50
        do {
            selected = item.children[Math.floor(Math.random()*(item.children.length - 1))]
            counter--
        } while(!selected.url && counter>=0)
        if(!selected.url)
            return
        window.open(selected.url)
    }     
}