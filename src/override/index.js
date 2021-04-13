let stateBuffer = {
    mode: "date-time",
    message: "Most people don't even get an opportunity to make a change. You do.",
    theme: 'theme-blues',
    pinnedItems: [],
    showPinnedOnAll: true,
}

window.onload = () => {
    console.log('init sesh...');

    initSesh();
    initSettingsEventListener();
    initSetup();
    // chrome.storage.local.clear();
};

function getDate() {
    const date = new Date();
    const formatted = `${date.getDate()}${nth(date.getDate())} ${date.toLocaleString('default', {month: 'short'})} , ${date.getFullYear()}`;
    return formatted;

    function nth(d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
    }
}

function getTime() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ampm;
    return strTime;
}

function getBookmarks() {
    chrome.bookmarks.getTree(function(result) {
        if(result && result[0]) {
            if(result[0].children) {
                let results = result[0].children;
                const bookmarksBar = results.filter(item => item.title.toLowerCase() === 'Bookmarks bar'.toLowerCase())[0];

                let bookmarkSearch = document.createElement("input");
                bookmarkSearch.id = `bookmarkSearch`;
                bookmarkSearch.className = "bookmarkSearch";
                bookmarkSearch.setAttribute("placeholder", "search");

                let bookmarkSearchContainer = document.createElement("div");
                bookmarkSearchContainer.id = `searchContainer`;
                bookmarkSearchContainer.className = "searchContainer";

                document.getElementById("bookmarksContainer").appendChild(bookmarkSearch);
                document.getElementById("bookmarksContainer").appendChild(bookmarkSearchContainer);

                bookmarkSearch.addEventListener('input', (event)=>searchBookmarks(event, bookmarksBar), false);

                populateBookmarks(0, bookmarksBar.children);
            }
        }
    });
}

function searchBookmarks(event, bookmarks) {
    const value = event.target.value;
    const searchContainer = document.getElementById("searchContainer");
    let oldResults = document.getElementById(`searchResultsContainer`);
    if(oldResults)
        oldResults.remove();

    if(value.trim() === '') {
        searchContainer.classList.remove("show");
        let bookmarkLevels = document.getElementsByClassName(`bookmarkLevel`);
        for (let i = 0; i < bookmarkLevels.length; i++) {
            bookmarkLevels[i].classList.remove('hide');
        }
        return;
    }
    let bookmarkLevels = document.getElementsByClassName(`bookmarkLevel`);
    for (let i = 0; i < bookmarkLevels.length; i++) {
        bookmarkLevels[i].classList.add('hide');
    }

    const searchResults = recursiveSearch([], bookmarks, value.toLowerCase());

    searchContainer.classList.add("show");

    if(searchResults.length === 0) {
        //show no results div
        if(document.getElementById('searchEmpty'))
            return;
        let searchEmpty = document.createElement("div");
        searchEmpty.id = `searchEmpty`;
        searchEmpty.className = "searchEmpty";
        searchEmpty.innerHTML = 'No results';
        searchContainer.appendChild(searchEmpty);
    }
    else {
        //hide search empty, show searchresults div
        if(document.getElementById('searchEmpty'))
            document.getElementById('searchEmpty').remove();

        const searchResultsContainer = document.createElement("div");
        searchResultsContainer.id = "searchResultsContainer";
        searchContainer.appendChild(searchResultsContainer);

        searchResults.forEach(item => {
            let result = document.createElement("div");
            result.className = "searchResult";
            searchResultsContainer.appendChild(result);
            let resultTitle = document.createElement("div");
            resultTitle.className = "resultTitle";
            resultTitle.innerHTML = trimText(item.title, 30);
            let resultLink = document.createElement("div");
            resultLink.className = "resultLink";
            resultLink.innerHTML = trimText(item.url, 50);
            result.appendChild(resultTitle);
            result.appendChild(resultLink);
            result.addEventListener('click', (event)=>clickSearchResult(event, item), false);
            result.addEventListener('dblclick', ()=>openLinks(item), false);
        });
    }
}
function clickSearchResult(event, item) {
    const searchResults = document.getElementsByClassName("searchResult");
    for(let i=0; i<searchResults.length; i++) {
        searchResults[i].classList.remove("active");
    }
    event.target.classList.add("active");
    updateStatusBar(item);
}

function recursiveSearch(list, bookmarks, value) {
    if(!bookmarks || (!bookmarks.url && (!bookmarks.children || bookmarks.children.length === 0))) {
        return list;
    }
    if(bookmarks.url) {
        if(bookmarks.url.toLowerCase().includes(value) || bookmarks.title.toLowerCase().includes(value))
            return [...list, { title: bookmarks.title, url: bookmarks.url }];
        else
            return list;
    }
    else {
        let newList= [];
        bookmarks.children.forEach(item => {
            newList = recursiveSearch(newList, item, value);
        });
        return [...list, ...newList];
    }
}

function populateBookmarks(level, bookmarks) {
    for(let i=level; i<level+10; i++) {
        let oldBookmarksLevel = document.getElementById(`bookmarkLevel-${i}`);
        if(oldBookmarksLevel)
            oldBookmarksLevel.remove();
    }
    if(!bookmarks || bookmarks.length === 0)
        return;

    let bookmarkLevel = document.createElement("div");
    bookmarkLevel.id = `bookmarkLevel-${level}`;
    bookmarkLevel.className = "bookmarkLevel";
    document.getElementById("bookmarksContainer").appendChild(bookmarkLevel);
    
    bookmarks.forEach((item, index) => {
        let bookmarkItem = document.createElement("div");
        bookmarkItem.id = `bookmark-${item.title}`;
        bookmarkItem.className = `bookmarkItem ${item.url ? `link` : `folder`}`;
        
        let connectorLeft = document.createElement("div");
        connectorLeft.className = `connectorLeft connector-to-${level}`;
        bookmarkItem.appendChild(connectorLeft);
        document.getElementById(`bookmarkLevel-${level}`).appendChild(bookmarkItem);

        let title = document.createElement("div");
        title.className = `itemTitle itemTitle-${level}`;
        title.innerHTML = item.url ? trimText(item.title, 90) : trimText(item.title, 30);
        bookmarkItem.appendChild(title);

        let pinIcon = document.createElement("img");
        pinIcon.className = `pinIcon`;
        pinIcon.src = 'icons/pin.svg';
        pinIcon.title = 'pin bookmark';
        bookmarkItem.appendChild(pinIcon);

        let connectorRight = document.createElement("div");
        connectorRight.className = `connectorRight connector-from-${level}`;
        bookmarkItem.appendChild(connectorRight);
        document.getElementById(`bookmarkLevel-${level}`).appendChild(bookmarkItem);

        let tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = item.url ? `Click to select,<br/>Double click to open link`
                                        : `Click to select,<br/>Double click to open all links,<br/>Right click to open random`;
        bookmarkItem.appendChild(tooltip);

        bookmarkItem.addEventListener('click', (event)=>selectBookmark(event, level, item, index, true), false);
        bookmarkItem.addEventListener('dblclick', ()=>openLinks(item), false);
        bookmarkItem.addEventListener('contextmenu', (event)=>openRandomLink(event, item), false);
        pinIcon.addEventListener('click', (e) => {e.stopPropagation(); updatePinnedItems('add', item)});
    });
}

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
        pinIcon.src = 'icons/unpin.svg';
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

function trimText(text, limit) {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
}

function selectBookmark(event, level, item, index, shouldOpenNextLevel) {
    if(shouldOpenNextLevel) {
        populateBookmarks(level+1, item.children);
        updateStatusBar(item);
    }

    let rightConnectors = document.getElementsByClassName(`connector-from-${level}`);
    for (let i = 0; i < rightConnectors.length; i++) {
        rightConnectors[i].classList.remove('active');
    }
    let leftConnectors = document.getElementsByClassName(`connector-to-${level+1}`);
    for (let i = 0; i < leftConnectors.length; i++) {
        if(leftConnectors[i])
            leftConnectors[i].classList.add('active');
    }

    let titles = document.getElementsByClassName(`itemTitle-${level}`);
    for (let i = 0; i < titles.length; i++) {
        titles[i].classList.remove('active');
    }
    if(shouldOpenNextLevel)
        event.target.classList.add('active');
    if(!item.url)
        event.target.parentElement.querySelector('.connectorRight').classList.add('active');

    
    let connectorVertical = document.createElement("div");
    connectorVertical.className = `connectorVertical connector-on-${level}`;
    const connectorHeight = item.children ? (index < item.children.length ? `${item.children.length*90 - 90}px` : '100%') : `0`;
    connectorVertical.style.height = connectorHeight;
    const nextLevel = document.getElementById(`bookmarkLevel-${level+1}`);
    if(nextLevel)
        nextLevel.appendChild(connectorVertical);
}

function updateStatusBar(item) {
    let oldStatusBar = document.getElementById("bookmarksStatusBar");
    if(oldStatusBar)
        oldStatusBar.remove();

    let itemDescription = document.createElement("div");
    let heading = document.createElement("div");
    let link = document.createElement("div");
    heading.className = "descriptionHeading";
    link.className="descriptionLink";
    itemDescription.className = "itemDescription";
    if(item.url) {
        heading.innerHTML = trimText(item.title, 200);
        link.innerHTML = trimText(item.url, 300);
        itemDescription.appendChild(heading);
        itemDescription.appendChild(link);
    }
    else {
        itemDescription.innerHTML = trimText(item.title, 90);
    }

    const bookmarksStatusBar = document.createElement("div");
    bookmarksStatusBar.id = "bookmarksStatusBar";
    bookmarksStatusBar.classList = "active";
    bookmarksStatusBar.appendChild(itemDescription);
    document.getElementById("bookmarksContainer").appendChild(bookmarksStatusBar);
}

function openLinks(item) {
    if(item.url)
        window.open(item.url, "_blank");
    else
        item.children.forEach(child => openLinks(child));
}
function openRandomLink(event, item) {
    event.preventDefault();
    if(item.url)
        return;
    else {
        let selected={}, counter = 50;
        do {
            selected = item.children[Math.floor(Math.random()*(item.children.length - 1))];
            counter--;
        } while(!selected.url && counter>=0);
        if(!selected.url)
            return;
        window.open(selected.url);
    }     
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

function initSesh() {
    fetchState();
}

function fetchState() {
    chrome.storage.local.get(['state'], function(result) {
        if(!result.state) {
            preloadSettings(stateBuffer);
            document.getElementById("seshParent").className = stateBuffer.theme;
            document.getElementById("settingsContainer").classList.add('show');
        }
        else {
            document.getElementById("seshParent").className = result.state.theme;
            loadApp(result.state);
        }
    });
}
    
function loadApp(state) {
    switch(state.mode) {
        case 'message': {
            let target = document.createElement("div");
            target.id = "messageContainer";
            target.innerHTML = state.message;
            document.getElementById("seshParent").appendChild(target);
            document.getElementById("messageInput").setAttribute("value", state.message);
            break;
        }
        case 'time': {
            let target = document.createElement("div");
            target.id = "dateTimeContainer";
            let timeContainer = document.createElement("div");
            timeContainer.id = "timeContainer";
            timeContainer.innerHTML = getTime();
            document.getElementById("seshParent").appendChild(target);
            document.getElementById("dateTimeContainer").appendChild(timeContainer);
            setInterval(updateDateTime, 5000);
            break;
        }
        case 'date-time': {
            let target = document.createElement("div");
            target.id = "dateTimeContainer";
            let timeContainer = document.createElement("div");
            timeContainer.id = "timeContainer";
            timeContainer.innerHTML = getTime();
            let dateContainer = document.createElement("div");
            dateContainer.id = "dateContainer";
            dateContainer.innerHTML = getDate();
            document.getElementById("seshParent").appendChild(target);
            document.getElementById("dateTimeContainer").appendChild(timeContainer);
            document.getElementById("dateTimeContainer").appendChild(dateContainer);
            setInterval(updateDateTime, 5000);
            break;
        }
        case 'bookmarks': {
            let bookmarksContainer = document.createElement("div");
            bookmarksContainer.id = "bookmarksContainer";
            document.getElementById("seshParent").appendChild(bookmarksContainer);
            getBookmarks();
            break;
        }
        case 'quotes': {
            let quotesContainer = document.createElement("div");
            quotesContainer.id = "quotesContainer";
            document.querySelector("#seshParent").appendChild(quotesContainer);
            getQuotes();
            break;
        }
        case 'nothing':
        default: {
        }
    }
    if(state.showPinnedOnAll) {
        loadPinnedItems(state);
    }
    preloadSettings(state);
}

function updateDateTime() {
    let timeContainer = document.getElementById("timeContainer");
    if(timeContainer) {
        timeContainer.innerHTML = getTime();
    }
    let dateContainer = document.getElementById("dateContainer");
    if(dateContainer) {
        dateContainer.innerHTML = getDate();
    }
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
        callback();
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

function getQuotes() {
    const randomQuote = quotes[Math.floor(Math.random()*(quotes.length))];
    let quoteContainer = document.createElement("div");
    quoteContainer.innerHTML = randomQuote;
    quoteContainer.id = "quoteContainer";
    document.querySelector("#quotesContainer").appendChild(quoteContainer);
}