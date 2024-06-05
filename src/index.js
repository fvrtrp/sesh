import './css/index.css'
import { loadSettings, updateLocalStorage } from './utils.js'
import { loadDateTime } from './addons/date-time/index.js'
import { loadTheme as loadNinjaTheme } from './addons/ninja-theme'
import { loadTheme as loadVanillaTheme } from './addons/vanilla-themes'
import { loadTheme as loadMessage } from './addons/message'
import { loadTheme as loadQuotes } from './addons/quotes'
import { loadTheme as loadGoogleEarth } from './addons/google-earth'
import { loadTheme as loadGeometryTheme } from './addons/geometry'
import { loadTheme as loadMoviePosters } from './addons/movie-posters'
import { loadTheme as loadAnalogClock } from './addons/analog-clock'
import { loadTheme as loadZenTheme } from './addons/zen'
import { loadTheme as loadSnake } from './addons/snake'
import { loadNotes } from './addons/notes/index.js'
import { loadBookmarks, loadPinnedBookmarks } from './addons/bookmarks/index.js'

export let stateBuffer = {
    message: "Most people don't even get an opportunity to make a change. You do.",
    pinnedItems: [],
    version: "3.0.0",
    theme: 'ninja',
    content: 'date-time',
    utilities: [
        "showPinnedBookmarks",
        "showBookmarksShortcut",
        "showNotes",
    ],
}
export let notes = {
    show: false,
    value: '',
}

window.onload = () => {
    console.log('init sesh...')
    //chrome.storage.local.clear();
    initSesh()
};

function initSesh() {
    chrome.storage.local.get(['state'], function (result) {
        let currentVersion = result.state ? Number.parseInt(result.state.version, 10) : 0
        if (!result.state || currentVersion < 3) {
            updateLocalStorage(initSesh())
        }
        else {
            loadApp(result.state)
            stateBuffer = result.state
        }
        loadSettings()
        loadBookmarks()
    });
}

export function loadApp(state) {
    // console.log(`zzz load`, state)
    loadTheme(state.theme)
    loadContent(state.content)
    loadUtilities(state)
}

function loadTheme(theme) {
    console.log(`loading theme`, theme)
    switch (theme) {
        case 'google-earth': {
            loadGoogleEarth()
            break
        }
        case 'movie-posters': {
            loadMoviePosters()
            break
        }
        case 'vanilla-themes': {
            loadVanillaTheme()
            break
        }
        case 'ninja': {
            loadNinjaTheme()
            break
        }
        case 'zen': {
            loadZenTheme()
            break
        }
        case 'geometry': {
            loadGeometryTheme()
            break
        }
        default: { }
    }
}

function loadContent(content) {
    switch (content) {
        case 'drunken-snake': {
            loadSnake()
            break
        }
        case 'date-time': {
            loadDateTime()
            break
        }
        case 'analog-clock': {
            loadAnalogClock()
            break
        }
        case 'nihilist quotes': {
            loadQuotes()
            break
        }
        case 'custom message': {
            loadMessage(stateBuffer.message)
            break
        }
        default: break
    }
}

function loadUtilities(state) {
    loadPinnedBookmarks(state)

    chrome.storage.local.get(['notes'], function (result) {
        console.log(`zzz notes`, result)
        if (result.notes) {
            notes = result.notes
        }
        loadNotes(notes)
    });
}