import { loadDateTime } from './addons/date-time.js'
import { loadQuotes } from './addons/quotes.js'
import { loadMessage } from './addons/message.js'
import { loadBookmarks } from './addons/bookmarks.js'

let stateBuffer = {
    mode: "date-time",
    message: "Most people don't even get an opportunity to make a change. You do.",
    //theme: 'theme-blues',
    pinnedItems: [],
    showPinnedOnAll: true,
    theme: 'ninja',
    content: 'bookmarks',
    utilities: ["showPinnedBookmarks"]
}

window.onload = () => {
    console.log('init sesh...')

    initSesh()
    // initSettingsEventListener()
    // initSetup()

    // chrome.storage.local.clear();
};



function initSesh() {
    // chrome.storage.local.get(['state'], function(result) {
    //     //redo this
    //     if(!result.state) {
    //         preloadSettings(stateBuffer);
    //         document.getElementById("seshParent").className = stateBuffer.theme;
    //         document.getElementById("settingsContainer").classList.add('show');
    //     }
    //     else {
    //         document.getElementById("seshParent").className = result.state.theme;
    //         loadApp(result.state);
    //     }
    // });
    loadApp(stateBuffer)
}

function loadApp(state) {
    loadTheme(state.theme)
    loadContent(state)
    //loadUtilities(state.utilities)
}

function loadTheme(theme) {

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


function updatePinnedItems(action, item) {
    if(action === 'add') {
        if(stateBuffer.pinnedItems)
            stateBuffer.pinnedItems.push(item);
        else
            stateBuffer.pinnedItems = [item];
    }
    else if(action === 'remove') {
        stateBuffer.pinnedItems = stateBuffer.pinnedItems.filter(bookmark => bookmark.id !== item);
    }
    updateLocalStorage(() => loadPinnedItems(stateBuffer));
}

function loadPinnedItems(state) {
    let container = document.querySelector('#pinnedItemsContainer');
    if(container)
        container.remove();
    if(!state.pinnedItems || state.pinnedItems.length===0)
        return;
    container = document.createElement('div');
    container.id = "pinnedItemsContainer";
    container.classList.add('show');
    document.getElementById("seshParent").appendChild(container);

    let pinnedTitle = document.createElement('div');
    pinnedTitle.classList.add('pinnedTitle');
    pinnedTitle.innerHTML = 'Pinned<br/>Bookmarks';
    container.appendChild(pinnedTitle);

    let pinnedItems = state.pinnedItems;
    pinnedItems.forEach((item, index) => {
        let bookmarkItem = document.createElement("div");
        bookmarkItem.id = `bookmark-${item.title}`;
        bookmarkItem.className = `bookmarkItem ${item.url ? `link` : `folder`}`;

        let title = document.createElement("div");
        title.className = `itemTitle`;
        title.innerHTML = item.url ? trimText(item.title, 90) : trimText(item.title, 30);
        bookmarkItem.appendChild(title);

        let pinIcon = document.createElement("img");
        pinIcon.className = `pinIcon unpin`;
        pinIcon.src = 'assets/unpin.svg';
        pinIcon.title = 'Unpin'
        bookmarkItem.appendChild(pinIcon);

        let tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = item.url ? `Double click to open link`
                                        : `Double click to open all links,<br/>Right click to open random`;
        bookmarkItem.appendChild(tooltip);

        bookmarkItem.addEventListener('click', (event)=>selectBookmark(event, 'pinned', item, index, false), false);
        bookmarkItem.addEventListener('dblclick', ()=>openLinks(item), false);
        bookmarkItem.addEventListener('contextmenu', (event)=>openRandomLink(event, item), false);
        pinIcon.addEventListener('click', (e) => {e.stopPropagation(); updatePinnedItems('remove', item.id)});

        container.appendChild(bookmarkItem);
    });
}


function initSettingsEventListener() {
    document.getElementById("settings").addEventListener('click', ()=>toggleSettingsScreen(true), false);
    document.getElementById("finish").addEventListener('click', ()=>finishSetup(true), false);
    document.getElementById("openBookmarks").addEventListener('click', ()=>openBookmarks(), false);
    document.getElementById("closeBookmarks").addEventListener('click', ()=>closeBookmarks(), false);
    document.querySelector("#showPinnedOnAll").addEventListener('click', ()=>toggleShowPinnedOnAll(false), false);
    document.querySelector("#hidePinnedOnAll").addEventListener('click', ()=>toggleShowPinnedOnAll(true), false);
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

function openBookmarks() {
    clearCurrentDivs();
    let closeButton = document.querySelector('#closeBookmarks');
    if(closeButton) 
        closeButton.classList.add('show');
    let bookmarksContainer = document.createElement("div");
    bookmarksContainer.id = "bookmarksContainer";
    document.getElementById("seshParent").appendChild(bookmarksContainer);
    let openBookmarks  = document.querySelector('#openBookmarks');
    if(openBookmarks)
        openBookmarks.classList.remove('show');
    let settingsButton  = document.querySelector('#settings');
    if(settingsButton)
        settingsButton.classList.remove('show');
    loadPinnedItems(stateBuffer);
    getBookmarks();
}
function closeBookmarks() {
    clearCurrentDivs();
    loadApp(stateBuffer);
    let closeBookmarks  = document.querySelector('#closeBookmarks');
    if(closeBookmarks)
        closeBookmarks.classList.remove('show');
    let openBookmarks  = document.querySelector('#openBookmarks');
    if(openBookmarks)
        openBookmarks.classList.add('show');
    let settingsButton  = document.querySelector('#settings');
    if(settingsButton)
        settingsButton.classList.add('show');
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

function updateLocalStorage(callback) {
    chrome.storage.local.set({"state": stateBuffer}, function() {
        if(callback)
            callback()
    });
}

function clearCurrentDivs() {
    const dateTimeContainer = document.getElementById("dateTimeContainer")
    if(dateTimeContainer)
        dateTimeContainer.remove();
    const messageContainer = document.getElementById("messageContainer")
    if(messageContainer)
        messageContainer.remove();
    const bookmarksContainer = document.getElementById("bookmarksContainer")
    if(bookmarksContainer)
        bookmarksContainer.remove();
    const quotesContainer = document.getElementById("quotesContainer")
    if(quotesContainer)
        quotesContainer.remove();
    const pinnedItemsContainer = document.getElementById("pinnedItemsContainer")
    if(pinnedItemsContainer)
        pinnedItemsContainer.remove();
}