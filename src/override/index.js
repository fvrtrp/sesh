import { loadDateTime } from './addons/date-time.js'
import { loadQuotes } from './addons/quotes.js'
import { loadMessage } from './addons/message.js'
import { loadBookmarks, showBookmarksShortcut, loadPinnedBookmarks, loadBookmarkStyles } from './addons/bookmarks/index.js'
import { loadVanillaTheme } from './addons/vanilla-themes/index.js'
import { loadNinjaTheme } from './addons/ninja-theme/index.js'
import { loadMoviePosters } from './addons/movie-posters/index.js'
import { loadZenTheme } from './addons/zen/index.js'
import { loadSettings, updateLocalStorage } from './utils.js'

export let stateBuffer = {
    message: "Most people don't even get an opportunity to make a change. You do.",
    pinnedItems: [],
    version: 0.3,
    theme: 'vanilla-themes',
    content: 'quotes',
    utilities: [
        "showPinnedBookmarks",
        "showBookmarksShortcut"
    ],
}

window.onload = () => {
    console.log('init sesh...')
    //chrome.storage.local.clear();
    initSesh()
    // initSettingsEventListener()
    // initSetup()
};



function initSesh() {
    chrome.storage.local.get(['state'], function(result) {
        console.log(`zzz result`, result)
        //redo this
        if(!result.state || (!'version' in result.state)) {
            //preloadSettings(stateBuffer)
            updateLocalStorage(initSesh())
            // document.getElementById("seshParent").className = stateBuffer.theme
            // document.getElementById("settingsContainer").classList.add('show')
        }
        else {
        //     document.getElementById("seshParent").className = result.state.theme;
            loadApp(result.state)
            stateBuffer = result.state
        }
    });
}

export function loadApp(state) {
    console.log(`loading app`)
    loadSettings()
    loadTheme(state.theme)
    //loadTheme('vanilla')
    loadContent(state)
    loadUtilities({...state, utilities:['showBookmarksShortcut', 'showPinnedBookmarks']})
    //loadUtilities(state)
    //preloadSettings(state)
}

function loadTheme(theme) {
    switch(theme) {
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
        loadBookmarkStyles()
    }
    if(state && state.utilities && state.utilities.includes('showPinnedBookmarks')) {
        loadPinnedBookmarks(state)
        loadBookmarkStyles()
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