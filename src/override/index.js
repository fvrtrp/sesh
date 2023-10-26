import './css/index.css'
import { loadDateTime } from './addons/date-time.js'
import { loadQuotes } from './addons/quotes.js'
import { loadMessage } from './addons/message.js'
import { loadBookmarks, showBookmarksShortcut, loadPinnedBookmarks } from './addons/bookmarks/index.js'
import './addons/bookmarks/index.scss'
import { loadTheme as loadVanillaTheme } from './addons/vanilla-themes/index.js'
import './addons/vanilla-themes/autumn.scss'
import './addons/vanilla-themes/blues.scss'
import { loadTheme as loadNinjaTheme } from './addons/ninja-theme/index.js'
import './addons/ninja-theme/index.scss'
import { loadTheme as loadMoviePosters } from './addons/movie-posters/index.js'
import './addons/movie-posters/index.scss'
import { loadTheme as loadZenTheme } from './addons/zen/index.js'
import './addons/zen/index.scss'
import { loadTheme as loadGeometryTheme } from './addons/geometry/index.js'
import './addons/geometry/index.scss'
import { loadTheme as loadGoogleEarth } from './addons/google-earth/index.js'
import './addons/google-earth/index.scss'
import { loadTheme as loadSnake } from './addons/snake/index.js'
import './addons/snake/index.scss'
import { loadAnalogClock } from './addons/analog-clock'
import './addons/analog-clock/index.scss'
import { loadSettings, updateLocalStorage } from './utils.js'

export let stateBuffer = {
    message: "Most people don't even get an opportunity to make a change. You do.",
    pinnedItems: [],
    version: "1.1.4",
    theme: 'google-earth',
    content: 'date-time',
    utilities: [
        "showPinnedBookmarks",
        "showBookmarksShortcut"
    ],
}

window.onload = () => {
    console.log('init sesh...')
    //chrome.storage.local.clear();
    initSesh()
};



function initSesh() {
    chrome.storage.local.get(['state'], function (result) {
        if (!result.state || (!'version' in result.state)) {
            updateLocalStorage(initSesh())
        }
        else {
            loadApp(result.state)
            stateBuffer = result.state
        }
    });
}

export function loadApp(state) {
    loadSettings()
    loadTheme(state.theme)
    loadContent(state)
    loadUtilities({ ...state, utilities: ['showBookmarksShortcut', 'showPinnedBookmarks'] })
}

function loadTheme(theme) {
    switch (theme) {
        case 'snake': {
            loadSnake()
            break
        }
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

function loadContent(state) {
    switch (state.content) {
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
            loadMessage(state.message)
            break
        }
        case 'bookmarks': {
            loadBookmarks()
            break
        }
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
}