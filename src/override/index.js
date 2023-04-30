import './css/index.css'
import { loadDateTime } from './addons/date-time.js'
import { loadQuotes } from './addons/quotes.js'
import { loadMessage } from './addons/message.js'
import { loadBookmarks, showBookmarksShortcut, loadPinnedBookmarks } from './addons/bookmarks/index.js'
import './addons/bookmarks/index.css'
import { loadTheme as loadVanillaTheme } from './addons/vanilla-themes/index.js'
import './addons/vanilla-themes/autumn.css'
import './addons/vanilla-themes/blues.css'
import { loadTheme as loadNinjaTheme } from './addons/ninja-theme/index.js'
import './addons/ninja-theme/index.css'
import { loadTheme as loadMoviePosters } from './addons/movie-posters/index.js'
import './addons/movie-posters/index.css'
import { loadTheme as loadZenTheme } from './addons/zen/index.js'
import './addons/zen/index.css'
import { loadTheme as loadGeometryTheme } from './addons/geometry/index.js'
import './addons/geometry/index.css'
import { loadTheme as loadGoogleEarth } from './addons/google-earth/index.js'
import './addons/google-earth/index.css'
import { loadSettings, updateLocalStorage } from './utils.js'

export let stateBuffer = {
    message: "Most people don't even get an opportunity to make a change. You do.",
    pinnedItems: [],
    version: "1.1.4",
    theme: 'geometry',
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
    chrome.storage.local.get(['state'], function(result) {
        if(!result.state || (!'version' in result.state)) {
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
    loadUtilities({...state, utilities:['showBookmarksShortcut', 'showPinnedBookmarks']})
}

function loadTheme(theme) {
    switch(theme) {
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
        default: {}
    }
}

function loadContent(state) {
    switch(state.content) {
        case 'date-time': {
            loadDateTime()
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
    if(state && state.utilities && state.utilities.includes('showBookmarksShortcut')) {
        showBookmarksShortcut()
    }
    if(state && state.utilities && state.utilities.includes('showPinnedBookmarks')) {
        loadPinnedBookmarks(state)
    }
}

function toggleShowPinnedOnAll(flag) {
    stateBuffer['showPinnedOnAll'] = flag;
    if(flag) {
        document.querySelector("#showPinnedOnAll").classList.add('show');
        document.querySelector("#hidePinnedOnAll").classList.remove('show');
    }
    else {
        document.querySelector("#showPinnedOnAll").classList.remove('show');
        document.querySelector("#hidePinnedOnAll").classList.add('show');
    }
}

function toggleSettingsScreen(flag) {
    if(flag) {
        document.getElementById("settingsContainer").classList.add('show');
        document.getElementById("settings").classList.remove('show');
        document.querySelector("#openBookmarks").classList.remove("show");
        document.querySelector("#closeBookmarks").classList.remove("show");
        let pinnedItemsContainer = document.querySelector("#pinnedItemsContainer");
        if(pinnedItemsContainer)
            pinnedItemsContainer.classList.remove('show');
    }
    else {
        document.getElementById("settingsContainer").classList.remove('show');
        document.getElementById("settings").classList.add('show');
        document.querySelector("#openBookmarks").classList.add("show");
        let pinnedItemsContainer = document.querySelector("#pinnedItemsContainer");
        if(pinnedItemsContainer)
            pinnedItemsContainer.classList.add('show');
    }
}

function preloadSettings(state) {
    // const option = document.querySelector(`div[value=${state.mode}]`);
    // if(option) {
    //     option.classList.add('active');
    // }
    // const theme = document.querySelector(`div[value=${state.theme}]`);
    // if(theme) {
    //     theme.classList.add('active');
    // }
    // const showPinnedOnAll = document.querySelector('#showPinnedOnAll');
    // const hidePinnedOnAll = document.querySelector('#hidePinnedOnAll');
    // if(state.showPinnedOnAll) {
    //     showPinnedOnAll.classList.add('show');
    //     hidePinnedOnAll.classList.remove('show');
    // }
    // else {
    //     showPinnedOnAll.classList.remove('show');
    //     hidePinnedOnAll.classList.add('show');
    // }
    stateBuffer = state;
}

function updateMessage(event) {
    stateBuffer['message'] = event.target.value;
}