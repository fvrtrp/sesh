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
    loadApp(stateBuffer)
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
    if(openBookmarks)   openBookmarks.remove()
    let settingsButton  = document.querySelector('#settings')
    if(settingsButton)  settingsButton.classList.remove('show')
    
    let settingsContainer = document.querySelector(`#settingsContainer`)
    if(settingsContainer)
        settingsContainer.remove()
    settingsContainer = createElement("settingsContainer", "settingsContainer show", "#seshParent")

    const themes = addons.themes
    const contentItems = addons.content
    const utilities = addons.utilities

    createElement("", "settingsParent", "#settingsContainer")

    createElement("","settingsSection themeSection",".settingsParent")
    let sectionTitle = createElement("", "sectionTitle", ".themeSection")
    sectionTitle.innerHTML = "themes"
    createElement("", "sectionItems themeItems", ".themeSection")
    themes.forEach(i => {
        let el = createElement("", "settingsItem themeOption", ".themeItems")
        el.innerHTML = i
        el.addEventListener('click', ()=>applySetting('theme', i, false))
    })

    createElement("","settingsSection contentSection",".settingsParent")
    sectionTitle = createElement("", "sectionTitle", ".contentSection")
    sectionTitle.innerHTML = "content"
    createElement("", "sectionItems contentItems", ".contentSection")
    contentItems.forEach(i => {
        let el = createElement("", "settingsItem contentOption", ".contentItems")
        el.innerHTML = i
        if(i==='custom message') {
            let inp = document.createElement('input')
            inp.value = stateBuffer['message']
            inp.classList.add('customInput')
            inp.addEventListener('input', (e) => {applySetting('content', {type: 'custom message', value: e.target.value})})
            el.appendChild(inp)
        }
        el.addEventListener('click', ()=>applySetting('content', i, false))
    })

    // createElement("","settingsSection utilitySection",".settingsParent")
    // sectionTitle = createElement("", "sectionTitle", ".utilitySection")
    // sectionTitle.innerHTML = "utility"
    // createElement("", "sectionItems utilityItems", ".utilitySection")
    // utilities.forEach(i => {
    //     let el = createElement("", "settingsItem utilityOption", ".utilityItems")
    //     el.innerHTML = i
    // })

}

function applySetting(type, val) {
    if(type === 'content' && val.type === 'custom message') {
        stateBuffer['content'] = 'custom message'
        stateBuffer['message'] = val.value
        updateLocalStorage()
        return
    }
    stateBuffer[type] = val
    console.log(`zzz`, stateBuffer)
    updateLocalStorage()
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
    console.log(`updating local`, {"state": stateBuffer})
    chrome.storage.local.set({"state": stateBuffer}, function() {
        if(callback)
            callback()
    });
}