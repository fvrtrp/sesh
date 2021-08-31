export function createElement(id, className, parent, type) {
    if(!type)
        type = "div"
    let el = document.createElement(type)
    el.id = id || ""
    el.className = className || ""
    if(parent)
        document.querySelector(parent).appendChild(el)
    return el
}

export function loadStyle(src) {
    return new Promise(function (resolve, reject) {
        let link = document.createElement('link')
        link.href = src
        link.rel = 'stylesheet'

        link.onload = () => resolve(link)
        link.onerror = () => reject(new Error(`Style load error for ${src}`))

        document.head.append(link)
    });
}

export function loadSettings() {
    //createElement("settingsContainer", "settingsContainer", "#seshParent")
    createElement("buttonContainer", "buttonContainer", "#seshParent")
    const settingsButton = createElement("settings", "show", "#buttonContainer")
    settingsButton.innerHTML = "settings"
}

export function clearCurrentDivs() {
    const dateTimeContainer = document.getElementById("dateTimeContainer")
    if(dateTimeContainer)
        dateTimeContainer.remove()
    const messageContainer = document.getElementById("messageContainer")
    if(messageContainer)
        messageContainer.remove()
    const bookmarksContainer = document.getElementById("bookmarksContainer")
    if(bookmarksContainer)
        bookmarksContainer.remove()
    const quotesContainer = document.getElementById("quotesContainer")
    if(quotesContainer)
        quotesContainer.remove()
    const pinnedItemsContainer = document.getElementById("pinnedItemsContainer")
    if(pinnedItemsContainer)
        pinnedItemsContainer.remove()
}