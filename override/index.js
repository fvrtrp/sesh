import './css/index.css'
import { loadDateTime } from './addons/date-time.js'
import { loadQuotes } from './addons/quotes.js'
import { loadMessage } from './addons/message.js'
import { loadBookmarks, showBookmarksShortcut, loadPinnedBookmarks } from './addons/bookmarks/index.js'
import { loadNotes } from './addons/notes'
import './addons/notes/index.scss'
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
    version: "2.4.1",
    theme: 'google-earth',
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
        if (!result.state || (!'version' in result.state)) {
            updateLocalStorage(initSesh())
        }
        else {
            loadSettings()
            loadApp(result.state)
            stateBuffer = result.state
        }
    });
    chrome.storage.local.get(['notes'], function (result) {
        console.log(`zzz notes`, result)
        if (result.notes) {
            notes = result.notes
        }
        loadNotes(notes)
    });
}

export function loadApp(state) {
    // console.log(`zzz load`, state)
    loadTheme(state.theme)
    loadContent(state)
    loadUtilities({ ...state, utilities: ['showBookmarksShortcut', 'showPinnedBookmarks'] })
}

function loadTheme(theme) {
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

function loadContent(state) {
    switch (state.content) {
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