import { stateBuffer, loadApp } from "./index.js"
import { cleanup as cleanupDateTime } from './addons/date-time.js'
import { cleanup as cleanupQuotes } from './addons/quotes.js'
import { cleanup as cleanupMessage } from './addons/message.js'
import { cleanup as cleanupBookmarks } from './addons/bookmarks/index.js'
import { cleanup as cleanupMoviePosters } from './addons/movie-posters/index.js'
import { addons } from './addons.js'

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
    settingsButton.addEventListener('click', ()=>openSettingsScreen(), false)
}

function closeSettingsScreen() {
    let settingsContainer = document.querySelector(`#settingsContainer`)
    if(settingsContainer)   settingsContainer.remove()
    clearCurrentDivs()
    loadApp()
}

function openSettingsScreen() {
    console.log(`opening settings`, addons)
    //clearCurrentDivs()
    clearCurrentDivs()
    let closeButton = document.querySelector('#closeBookmarks')
    if(closeButton) closeButton.classList.add('show')
    closeButton.addEventListener('click', ()=>closeSettingsScreen(), false)

    createElement("bookmarksContainer", "", "#seshParent")
    let openBookmarks  = document.querySelector('#openBookmarks')
    if(openBookmarks)   openBookmarks.classList.remove('show')
    let settingsButton  = document.querySelector('#settings')
    if(settingsButton)  settingsButton.classList.remove('show')
    
    let settingsContainer = document.querySelector(`#settingsContainer`)
    if(settingsContainer)
        settingsContainer.remove()
    settingsContainer = createElement("settingsContainer", "settingsContainer show", "#seshParent")
    let settingsString = `<div class="settingsParent">`
    const themes = addons.themes
    const contentItems = addons.content
    const utilities = addons.utilities

    settingsString += `<div class="settingsSection themeSection"><div class="sectionTitle">themes</div><div class="sectionItems">`
    themes.forEach(i => {
        settingsString += `<div class="settingsItem themeOption">${i}</div>`
    })
    settingsString += `</div></div>`
    settingsString += `<div class="settingsSection contentSection"><div class="sectionTitle">content</div><div class="sectionItems">`
    contentItems.forEach(i => {
        settingsString += `<div class="settingsItem contentOption">${i}</div>`
    })
    settingsString += `</div></div>`
    settingsString += `<div class="settingsSection utilitySection"><div class="sectionTitle">utilities</div><div class="sectionItems">`
    utilities.forEach(i => {
        settingsString += `<div class="settingsItem utilityOption">${i}</div>`
    })
    settingsString += `</div></div>`

    settingsString += `</div>`
    settingsContainer.innerHTML = settingsString
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