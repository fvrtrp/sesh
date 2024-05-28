import './css/index.css'
import { loadDateTime } from './addons/date-time/index.js'
import { loadTheme as loadNinjaTheme } from './addons/ninja-theme'
import { loadTheme as loadVanillaTheme } from './addons/vanilla-themes'
import { loadSettings, updateLocalStorage } from './utils.js'

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
    show: true,
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
            loadSettings()
        }
    });
}

export function loadApp(state) {
    // console.log(`zzz load`, state)
    loadTheme(state.theme)
    loadContent(state.content)
    // loadUtilities([
    //     "showPinnedBookmarks",
    //     "showBookmarksShortcut",
    //     "showNotes",
    // ])
}

function loadTheme(theme) {
    console.log(`loading theme`, theme)
    switch (theme) {
        // case 'google-earth': {
        //     loadGoogleEarth()
        //     break
        // }
        // case 'movie-posters': {
        //     loadMoviePosters()
        //     break
        // }
        case 'vanilla-themes': {
            loadVanillaTheme()
            break
        }
        case 'ninja': {
            loadNinjaTheme()
            break
        }
        // case 'zen': {
        //     loadZenTheme()
        //     break
        // }
        // case 'geometry': {
        //     loadGeometryTheme()
        //     break
        // }
        default: { }
    }
}

function loadContent(content) {
    switch (content) {
        // case 'drunken-snake': {
        //     loadSnake()
        //     break
        // }
        case 'date-time': {
            loadDateTime()
            break
        }
        // case 'analog-clock': {
        //     loadAnalogClock()
        //     break
        // }
        // case 'nihilist quotes': {
        //     loadQuotes()
        //     break
        // }
        case 'custom message': {
            loadMessage(state.message)
            break
        }
        // case 'bookmarks': {
        //     loadBookmarks()
        //     break
        // }
        default: break
    }
}

function loadUtilities(state) {
    if (state && state.utilities && state.utilities.includes('showBookmarksShortcut')) {
        showBookmarksShortcut()
    }
    if (state && state.utilities && state.utilities.includes('showPinnedBookmarks')) {
        loadPinnedBookmarks(state)
    }
    if (state && state.utilities && state.utilities.includes('showNotes')) {
        loadPinnedBookmarks(state)
    }
}