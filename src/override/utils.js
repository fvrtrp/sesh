import { stateBuffer } from "./index.js"
import { cleanup as cleanupDateTime } from './addons/date-time.js'
import { cleanup as cleanupQuotes } from './addons/quotes.js'
import { cleanup as cleanupMessage } from './addons/message.js'
import { cleanup as cleanupBookmarks } from './addons/bookmarks/index.js'
import { cleanup as cleanupMoviePosters } from './addons/movie-posters/index.js'

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
    const buttonContainer = document.querySelector("#buttonContainer")
    if(!buttonContainer)
        createElement("buttonContainer", "buttonContainer", "#seshParent")
    const settingsButton = createElement("settings", "show", "#buttonContainer")
    settingsButton.innerHTML = "settings"
}

export function clearCurrentDivs() {
    console.log(`clearing divs`)
    cleanupDateTime()
    cleanupMessage()
    cleanupQuotes()
    cleanupMoviePosters()
    //cleanupBookmarks()
    const settingsButton = document.querySelector("#settings")
    if(settingsButton)  settingsButton.remove()
}

export function updateLocalStorage(callback) {
    chrome.storage.local.set({"state": stateBuffer}, function() {
        if(callback)
            callback()
    });
}