import { stateBuffer, loadApp } from "./index.js"
import { cleanup as cleanupDateTime } from './addons/date-time.js'
import { cleanup as cleanupQuotes } from './addons/quotes.js'
import { cleanup as cleanupMessage } from './addons/message.js'
import { cleanup as cleanupBookmarks } from './addons/bookmarks/index.js'
import { cleanup as cleanupMoviePosters } from './addons/movie-posters/index.js'
import { cleanup as cleanupZen } from './addons/zen/index.js'
import { cleanup as cleanupGeometry } from './addons/geometry/index.js'
import { cleanup as cleanupGoogleEarth } from './addons/google-earth/index.js'
import { addons } from './addons.js'

export function createElement(id, className, parent, type, method) {
    if(!type)
        type = "div"
    let el = document.createElement(type)
    el.id = id || ""
    el.className = className || ""
    if(parent) {
        if(method==='unshift')
            document.querySelector(parent).insertBefore(el, document.querySelector(parent).children[0])
        else
            document.querySelector(parent).appendChild(el)
    }
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
    let settingsClose = document.querySelector(`#closeSettings`)
    if(settingsClose)   settingsClose.remove()
    clearCurrentDivs()
    loadApp(stateBuffer)
}

function openSettingsScreen() {
    clearCurrentDivs()
    let closeButton = document.querySelector('#closeSettings')
    if(closeButton) closeButton.remove()
    closeButton = createElement("closeSettings", "show", "#buttonContainer")
    closeButton.innerHTML = "close"
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

    const bg = createElement('settingsBg', 'settingsBg', '#settingsContainer', 'img')
    bg.src = "./sesh-rounded-bg.svg"

    const attribution = createElement("attribution", "attribution", "#settingsContainer", "a")
    attribution.className = "attribution"
    attribution.innerHTML = "sesh"
    attribution.href = "https://fvrtrp.github.io/sesh"

    const settingsIcon = createElement("settingsIcon", "settingsIcon", "#settingsContainer", "img")
    settingsIcon.src = "../../../icons/icon128.png"
    settingsIcon.setAttribute('title', 'sesh by fevertrip')

    const themes = addons.themes
    const contentItems = addons.content
    const utilities = addons.utilities

    createElement("", "settingsParent", "#settingsContainer")

    createElement("","settingsSection themeSection",".settingsParent")
    let sectionTitle = createElement("", "sectionTitle", ".themeSection")
    sectionTitle.innerHTML = "themes"
    createElement("", "sectionItems themeItems", ".themeSection")
    themes.forEach((i, index) => {
        let el = createElement(`theme-${index}`, "settingsItem themeOption", ".themeItems")
        el.innerHTML = i
        el.addEventListener('click', ()=>applySetting('theme', i, false))
    })

    createElement("","settingsSection contentSection",".settingsParent")
    sectionTitle = createElement("", "sectionTitle", ".contentSection")
    sectionTitle.innerHTML = "content"
    createElement("", "sectionItems contentItems", ".contentSection")
    contentItems.forEach((i, index) => {
        let el = createElement(`content-${index}`, "settingsItem contentOption", ".contentItems")
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

    updateHighlights()
    attachCursorStyle()
    attachItemStyles()
}

function attachItemStyles() {
    for(let item of document.querySelectorAll('.settingsItem')) {
        const att = createElement('decor', 'decor')
        item.appendChild(att)
    }
}

function attachCursorStyle() {
    const el = createElement('cursorHighlight', 'cursorHighlight', ".settingsContainer")
    const radius = 50
    document.addEventListener('mousemove', (e) => {
        el.style.width = radius + 'px'
        el.style.height = radius + 'px'
        cursorHighlight.style.left = e.clientX-radius/2 + 'px'
        cursorHighlight.style.top = e.clientY-radius/2 + 'px'
    })
}

function applySetting(type, val) {
    if(type === 'content' && val.type === 'custom message') {
        stateBuffer['content'] = 'custom message'
        stateBuffer['message'] = val.value
        updateHighlights()
        updateLocalStorage()
        return
    }
    stateBuffer[type] = val
    updateHighlights()
    updateLocalStorage()
}

function updateHighlights() {
    const themes = addons.themes
    const contentItems = addons.content

    themes.forEach((i, index) => {
        const el = document.querySelector(`#theme-${index}`)
        if(el && stateBuffer['theme'] === i)  el.classList.add('active')
        else    el.classList.remove('active')
    })
    contentItems.forEach((i, index) => {
        const el = document.querySelector(`#content-${index}`)
        if(el && stateBuffer['content'] === i)  el.classList.add('active')
        else    el.classList.remove('active')
    })
}

export function clearCurrentDivs() {
    console.log(`clearing divs`)
    cleanupDateTime()
    cleanupMessage()
    cleanupQuotes()
    cleanupMoviePosters()
    cleanupZen()
    cleanupGeometry()
    cleanupGoogleEarth()
    cleanupBookmarks()
    const settingsButton = document.querySelector("#settings")
    if(settingsButton)  settingsButton.remove()
}

export function updateLocalStorage(callback) {
    // console.log(`updating local`, {"state": stateBuffer})
    chrome.storage.local.set({"state": stateBuffer}, function() {
        if(callback)
            callback()
    });
}

export function launch_toast(message='') {
    const x = document.getElementById("toast")
    x.className = "show";
    if(message) {
        x.innerText = message
    }
    setTimeout(function(){
        x.className = x.className.replace("show", "");
    }, 2000);
}