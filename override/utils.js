import { stateBuffer, loadApp, notes } from "./index.js"
import { cleanup as cleanupDateTime } from './addons/date-time.js'
import { cleanup as cleanupQuotes } from './addons/quotes.js'
import { cleanup as cleanupMessage } from './addons/message.js'
import { cleanup as cleanupBookmarks } from './addons/bookmarks/index.js'
import { cleanup as cleanupMoviePosters } from './addons/movie-posters/index.js'
import { cleanup as cleanupZen } from './addons/zen/index.js'
import { cleanup as cleanupGeometry } from './addons/geometry/index.js'
import { cleanup as cleanupGoogleEarth } from './addons/google-earth/index.js'
import { cleanup as cleanupAnalogClock } from './addons/analog-clock'
import { cleanup as cleanupSnake } from './addons/snake'
import { cleanup as cleanupNotes } from './addons/notes'
import { addons } from './addons.js'
import { loadNotes } from "./addons/notes/index.js"

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

export function loadSettings() {
    console.log(`loading settings`)
    const buttonContainer = document.querySelector("#buttonContainer")
    if(!buttonContainer)
        createElement("buttonContainer", "buttonContainer", "#seshParent")
    
    const settingsButton = createElement("settings", "show", "#buttonContainer")
    settingsButton.innerHTML = "settings"
    settingsButton.addEventListener('click', ()=>openSettingsScreen(), false)

    const settingsParent = document.querySelector('#settingsParent')
    const closeButton = settingsParent.querySelector('.close');
    closeButton.addEventListener('click', () => closeSettingsScreen())

    const themes = addons.themes
    const contentItems = addons.content

    createElement("","settingsSection themeSection","#settingsParent")
    let sectionTitle = createElement("", "sectionTitle", ".themeSection")
    sectionTitle.innerHTML = "themes"
    createElement("", "sectionItems themeItems", ".themeSection")
    themes.forEach((i, index) => {
        let el = createElement(`theme-${index}`, "settingsItem themeOption", ".themeItems")
        el.innerHTML = i
        el.addEventListener('click', ()=>applySetting('theme', i, false))
    })

    createElement("","settingsSection contentSection","#settingsParent")
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

function closeSettingsScreen() {
    const settingsParent = document.querySelector('#settingsParent')
    settingsParent.classList.remove('show')
    clearCurrentDivs()
    loadApp(stateBuffer)
    loadNotes(notes)
}

function openSettingsScreen() {
    // clearCurrentDivs()
    const settingsParent = document.querySelector('#settingsParent')
    settingsParent.classList.add('show');
}

function attachItemStyles() {
    for(let item of document.querySelectorAll('.settingsItem')) {
        const att = createElement('decor', 'decor')
        item.appendChild(att)
    }
}

function attachCursorStyle() {
    const el = createElement('cursorHighlight', 'cursorHighlight', "#settingsParent")
    const radius = 50
    document.addEventListener('mousemove', (e) => {
        el.style.width = radius + 'px'
        el.style.height = radius + 'px'
        el.style.left = e.clientX-radius/2 + 'px'
        el.style.top = e.clientY-radius/2 + 'px'
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
    cleanupDateTime()
    cleanupMessage()
    cleanupQuotes()
    cleanupMoviePosters()
    cleanupZen()
    cleanupGeometry()
    cleanupGoogleEarth()
    cleanupAnalogClock()
    cleanupBookmarks()
    cleanupSnake()
    cleanupNotes()
    const settingsButton = document.querySelector("#settings")
    if(settingsButton)  settingsButton.remove()
}

export function updateLocalStorage(callback) {
    chrome.storage.local.set({"state": stateBuffer}, function() {
        if(callback)
            callback()
    });
}

export function updateNotes(value) {
    chrome.storage.local.set({"notes": value}, function() {
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