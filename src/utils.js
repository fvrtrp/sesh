import { stateBuffer, loadApp, notes } from "./index.js"
import { addons } from './addons.js'

export function createElement(id, className, parent, type, method) {
    if (!type)
        type = "div"
    let el = document.createElement(type)
    el.id = id || ""
    el.className = className || ""
    if (parent) {
        if (method === 'unshift')
            document.querySelector(parent).insertBefore(el, document.querySelector(parent).children[0])
        else
            document.querySelector(parent).appendChild(el)
    }
    return el
}

export function loadSettings() {
    console.log(`loading settings`)
    const controls = document.querySelector("#controls")
    const settingsButton = controls.querySelector("#settingsControl")
    settingsButton.addEventListener('click', openSettingsScreen, false)
    const closeButton = controls.querySelector('#closeControl');
    closeButton.addEventListener('click', closeSettingsScreen);

    const themes = addons.themes
    const contentItems = addons.content

    createElement("", "settingsSection themeSection", "#settingsParent")
    let sectionTitle = createElement("", "sectionTitle", ".themeSection")
    sectionTitle.innerHTML = "themes"
    createElement("", "sectionItems themeItems", ".themeSection")
    themes.forEach((i, index) => {
        let el = createElement(`theme-${index}`, "settingsItem themeOption", ".themeItems")
        el.innerHTML = i
        el.addEventListener('click', () => applySetting('theme', i, false))
    })

    createElement("", "settingsSection contentSection", "#settingsParent")
    sectionTitle = createElement("", "sectionTitle", ".contentSection")
    sectionTitle.innerHTML = "content"
    createElement("", "sectionItems contentItems", ".contentSection")
    contentItems.forEach((i, index) => {
        let el = createElement(`content-${index}`, "settingsItem contentOption", ".contentItems")
        el.innerHTML = i
        if (i === 'custom message') {
            let inp = document.createElement('input')
            inp.value = stateBuffer['message']
            inp.classList.add('customInput')
            inp.addEventListener('input', (e) => { applySetting('content', { type: 'custom message', value: e.target.value }) })
            el.appendChild(inp)
        }
        el.addEventListener('click', () => applySetting('content', i, false))
    })

    updateHighlights()
    attachItemStyles()
}

function closeSettingsScreen() {
    const settingsParent = document.querySelector('#settingsParent')
    settingsParent.classList.remove('show')

    const controls = document.querySelector("#controls")
    const settingsButton = controls.querySelector("#settingsControl")
    settingsButton.classList.add('show');
    const bookmarksButton = controls.querySelector("#bookmarksControl")
    bookmarksButton.classList.add('show');
    const closeButton = controls.querySelector('#closeControl');
    closeButton.classList.remove('show');
    clearCurrentDivs()
    loadApp(stateBuffer)
}

function openSettingsScreen() {
    // clearCurrentDivs()
    const settingsParent = document.querySelector('#settingsParent')
    settingsParent.classList.add('show');

    const controls = document.querySelector("#controls")
    const settingsButton = controls.querySelector("#settingsControl")
    settingsButton.classList.remove('show');
    const bookmarksButton = controls.querySelector("#bookmarksControl")
    bookmarksButton.classList.remove('show');
    const closeButton = controls.querySelector('#closeControl');
    closeButton.classList.add('show');
}

function attachItemStyles() {
    for (let item of document.querySelectorAll('.settingsItem')) {
        const att = createElement('decor', 'decor')
        item.appendChild(att)
    }
}

function applySetting(type, val) {
    if (type === 'content' && val.type === 'custom message') {
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
        if (el && stateBuffer['theme'] === i) el.classList.add('active')
        else el.classList.remove('active')
    })
    contentItems.forEach((i, index) => {
        const el = document.querySelector(`#content-${index}`)
        if (el && stateBuffer['content'] === i) el.classList.add('active')
        else el.classList.remove('active')
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
    if (settingsButton) settingsButton.remove()
}

export function updateLocalStorage(callback) {
    chrome.storage.local.set({ "state": stateBuffer }, function () {
        if (callback)
            callback()
    });
}

export function updateNotes(value) {
    chrome.storage.local.set({ "notes": value }, function () {
    });
}

export function launch_toast(message = '') {
    const x = document.getElementById("toast")
    x.className = "show";
    if (message) {
        x.innerText = message
    }
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 2000);
}