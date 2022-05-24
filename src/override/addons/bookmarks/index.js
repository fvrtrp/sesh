import { createElement, clearCurrentDivs, updateLocalStorage, loadStyle } from '../../utils.js'
import { stateBuffer, loadApp } from '../../index.js'

const selectedBookmark = {}

export function loadBookmarks() {
    console.log(`loading bookmarks`)
    loadCss()
}

export function loadBookmarkStyles() {
    loadStyle("addons/bookmarks/index.css")
    .then(() => {
    }).catch(err => alert(err))
}

function loadCss() {
    loadStyle("addons/bookmarks/index.css")
    .then(() => {
        resumeLoading()
    }).catch(err => alert(err))
}

function resumeLoading() {
    //createElement("bookmarksContainer","", "#seshParent")
    getBookmarks()
}

export function showBookmarksShortcut() {
    const bookmarksButton = createElement("openBookmarks","show", "#buttonContainer")
    bookmarksButton.innerHTML = "bookmarks" 
    bookmarksButton.addEventListener('click', ()=>openBookmarks(), false)

    const closeButton = createElement("closeBookmarks", "", "#buttonContainer")
    closeButton.innerHTML = "close"
    //bookmarksButton.addEventListener('click', ()=>openBookmarks(), false)
    closeButton.addEventListener('click', ()=>closeBookmarks(), false);
}

function openBookmarks() {
    console.log(`zzzopencalled`)
    clearCurrentDivs()
    let closeButton = document.querySelector('#closeBookmarks')
    if(closeButton) closeButton.classList.add('show')
    createElement("bookmarksContainer", "", "#seshParent")
    let openBookmarks  = document.querySelector('#openBookmarks')
    if(openBookmarks)   openBookmarks.classList.remove('show')
    let settingsButton  = document.querySelector('#settings')
    if(settingsButton)  settingsButton.classList.remove('show')
    loadPinnedBookmarks(stateBuffer)
    getBookmarks()
}

function closeBookmarks() {
    let closeButton = document.querySelector('#closeBookmarks')
    if(closeButton) closeButton.remove()
    let openBookmarks  = document.querySelector('#openBookmarks')
    if(openBookmarks)   openBookmarks.remove()
    const bookmarksContainer = document.querySelector("#bookmarksContainer")
    if(bookmarksContainer)  bookmarksContainer.remove()
    const pinnedItemsContainer = document.querySelector("#pinnedItemsContainer")
    if(pinnedItemsContainer)    pinnedItemsContainer.remove()

    clearCurrentDivs()
    loadApp(stateBuffer)
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
                bookmarkSearch.setAttribute("placeholder", "search by title, url etc")

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
    for(let i=level; i<level+15; i++) {
        let oldBookmarksLevel = document.getElementById(`bookmarkLevel-${i}`)
        if(oldBookmarksLevel)
            oldBookmarksLevel.remove()
    }
    if(!bookmarks || bookmarks.length === 0)
        return

    const bookmarkLevel = createElement(`bookmarkLevel-${level}`, "bookmarkLevel", "#bookmarksContainer")
    createElement(`bookmarksContainer-${level}`, "bookmarksContainer", `#bookmarkLevel-${level}`)

    bookmarkLevel.addEventListener('scroll', ()=>updateConnector(level), false)
    
    bookmarks.forEach((item, index) => {
        let bookmarkItem = createElement(
            `bookmark-${item.title}`,
            `bookmarkItem ${item.url ? `link` : `folder`}`,
            `#bookmarksContainer-${level}`
        )

        let title = createElement("", `itemTitle itemTitle-${level}`)
        title.innerHTML = item.url ? trimText(item.title, 90) : trimText(item.title, 30)
        bookmarkItem.appendChild(title)

        let pinIcon = document.createElement("img")
        pinIcon.className = `pinIcon`
        pinIcon.src = 'addons/bookmarks/assets/pin.svg'
        pinIcon.title = 'pin bookmark'
        bookmarkItem.appendChild(pinIcon)

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

    let titles = document.getElementsByClassName(`itemTitle-${level}`)
    for (let i = 0; i < titles.length; i++) {
        titles[i].classList.remove('active')
    }

    if(shouldOpenNextLevel)
        event.target.classList.add('active')

    const el = event.target
    if(!item.url) {
        selectedBookmark[level] = el
        updateConnector(level, true)
    }
    else {
        removeConnector(level)
    }
}

function updateConnector(level, create) {
    if(!selectedBookmark || !selectedBookmark[level])   return
    const el = selectedBookmark[level]
    const position = el.getBoundingClientRect()
    const levelScroll = document.querySelector(`#bookmarkLevel-${level}`).scrollTop
    const connectorHeight = levelScroll + position.y - 120
    let svgContainer = document.querySelector(`#svgConnector-${level}`)
    if(create) {
        if(svgContainer)
            svgContainer.remove()
        svgContainer = createElement(`svgConnector-${level}`, `svgConnector`, `#bookmarkLevel-${level}`)
    }
    if(!svgContainer)
        return
    svgContainer.style["height"] = `${connectorHeight}px`
    const yMax = connectorHeight, yMin = levelScroll+30
    svgContainer.innerHTML = `
    <svg viewBox="0 0 150 ${yMax}">
        <path d="
            M 0, ${yMax}
            Q 75,${yMax} 75,${(yMax+yMin)/2}
            T 150, ${yMin}
            "
        />
    </svg>  
    `
}

function removeConnector(level) {
    let svgContainer = document.querySelector(`#svgConnector-${level}`)
    if(svgContainer)
        svgContainer.remove()
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


export function loadPinnedBookmarks(state) {
    let container = document.querySelector('#pinnedItemsContainer')
    if(container)
        container.remove()
    if(!state.pinnedItems || state.pinnedItems.length===0)
        return
    container = createElement('pinnedItemsContainer', 'show', '#seshParent')

    let pinnedTitle = document.createElement('div')
    pinnedTitle.classList.add('pinnedTitle')
    pinnedTitle.innerHTML = 'Pinned'
    container.appendChild(pinnedTitle)

    let pinnedItems = state.pinnedItems
    pinnedItems.forEach((item, index) => {
        let bookmarkItem = document.createElement("div")
        bookmarkItem.id = `bookmark-${item.title}`
        bookmarkItem.className = `bookmarkItem ${item.url ? `link` : `folder`}`

        let title = document.createElement("div")
        title.className = `itemTitle`
        title.innerHTML = item.url ? trimText(item.title, 90) : trimText(item.title, 30)
        bookmarkItem.appendChild(title)

        let pinIcon = document.createElement("img")
        pinIcon.className = `pinIcon unpin`
        pinIcon.src = 'addons/bookmarks/assets/unpin.svg'
        pinIcon.title = 'Unpin'
        bookmarkItem.appendChild(pinIcon)

        let tooltip = document.createElement('div')
        tooltip.classList.add('tooltip')
        tooltip.innerHTML = item.url ? `Double click to open link`
                                        : `Double click to open all links,<br/>Right click to open random`
        bookmarkItem.appendChild(tooltip);

        bookmarkItem.addEventListener('click', (event)=>selectBookmark(event, 'pinned', item, index, false), false)
        bookmarkItem.addEventListener('dblclick', ()=>openLinks(item), false)
        bookmarkItem.addEventListener('contextmenu', (event)=>openRandomLink(event, item), false)
        pinIcon.addEventListener('click', (e) => {e.stopPropagation(); updatePinnedItems('remove', item.id)})

        container.appendChild(bookmarkItem);
    });
}

function updatePinnedItems(action, item) {
    if(action === 'add') {
        if(stateBuffer.pinnedItems)
            stateBuffer.pinnedItems.push(item)
        else
            stateBuffer.pinnedItems = [item]
    }
    else if(action === 'remove') {
        stateBuffer.pinnedItems = stateBuffer.pinnedItems.filter(bookmark => bookmark.id !== item)
    }
    updateLocalStorage(() => loadPinnedBookmarks(stateBuffer))
}

export function cleanup() {
}