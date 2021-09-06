import { loadDateTime } from './addons/date-time.js'
import { loadQuotes } from './addons/quotes.js'
import { loadMessage } from './addons/message.js'
import { loadBookmarks, showBookmarksShortcut, loadPinnedBookmarks } from './addons/bookmarks/index.js'
import { loadMoviePosters } from './addons/movie-posters/index.js'
import { loadSettings } from './utils.js'

export let stateBuffer = {
    message: "Most people don't even get an opportunity to make a change. You do.",
    pinnedItems: [],
    version: 0.3,
    theme: 'movie-posters',
    content: 'quotes',
    utilities: ["showPinnedBookmarks", "showBookmarksShortcut"],
}

window.onload = () => {
    console.log('init sesh...')

    initSesh()
    // initSettingsEventListener()
    // initSetup()

    // chrome.storage.local.clear();
};



function initSesh() {
    chrome.storage.local.get(['state'], function(result) {
        console.log(`zzz result`, result)
        //redo this
        if(!result.state || (!'version' in result.state)) {
            // preloadSettings(stateBuffer)
            // document.getElementById("seshParent").className = stateBuffer.theme
            // document.getElementById("settingsContainer").classList.add('show')
        }
        // else {
        //     document.getElementById("seshParent").className = result.state.theme;
        //     loadApp(result.state);
            loadSettings()
            loadApp(result.state)
        // }
    });
}

export function loadApp(state) {
    loadTheme(state.theme)
    loadContent(state)
    loadUtilities(state)
    //loadUtilities(state.utilities)
}

function loadTheme(theme) {
    switch(theme) {
        case 'movie-posters': {
            loadMoviePosters()
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
        case 'quotes': {
            loadQuotes()
            break
        }
        case 'message': {
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

// function loadApp(state) {
//     switch(state.mode) {
//         case 'bookmarks': {
//             let bookmarksContainer = document.createElement("div");
//             bookmarksContainer.id = "bookmarksContainer";
//             document.getElementById("seshParent").appendChild(bookmarksContainer);
//             getBookmarks();
//             break;
//         }
//     }
//     if(state.showPinnedOnAll) {
//         loadPinnedItems(state);
//     }
//     preloadSettings(state);
// }

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
    const option = document.querySelector(`div[value=${state.mode}]`);
    if(option) {
        option.classList.add('active');
    }
    const theme = document.querySelector(`div[value=${state.theme}]`);
    if(theme) {
        theme.classList.add('active');
    }
    const showPinnedOnAll = document.querySelector('#showPinnedOnAll');
    const hidePinnedOnAll = document.querySelector('#hidePinnedOnAll');
    if(state.showPinnedOnAll) {
        showPinnedOnAll.classList.add('show');
        hidePinnedOnAll.classList.remove('show');
    }
    else {
        showPinnedOnAll.classList.remove('show');
        hidePinnedOnAll.classList.add('show');
    }
    stateBuffer = state;
}

function initSetup() {
    let elements = document.getElementsByClassName("option");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', updateState, false);
    }

    let themeButtons = document.getElementsByClassName("preview");
    for (let i = 0; i < elements.length; i++) {
        if(themeButtons[i])
            themeButtons[i].addEventListener('click', updateTheme, false);
    }
}

function updateState(event) {
    let elements = document.getElementsByClassName("option");
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
    }
    event.target.classList.add('active');
    const mode = event.target.getAttribute("value");
    stateBuffer['mode'] = mode;
    if(mode === 'message') {
        document.getElementById("messageInput").classList.add("show");
        document.getElementById("messageInput").addEventListener('change', updateMessage, false);
    }
    else {
        document.getElementById("messageInput").classList.remove("show");
    }
}
function updateMessage(event) {
    stateBuffer['message'] = event.target.value;
}

function updateTheme(event) {
    let elements = document.getElementsByClassName("preview");
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
    }
    event.target.classList.add('active');
    const theme = event.target.getAttribute("value");
    stateBuffer['theme'] = theme;
    document.getElementById("seshParent").className = theme;
}

function finishSetup() {
    chrome.storage.local.set({"state": stateBuffer}, function() {
        toggleSettingsScreen(false);
        clearCurrentDivs();
        loadApp(stateBuffer);
    });
}