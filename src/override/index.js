let stateBuffer = {
    mode: "date-time",
    message: "The majority of people don't even get an opportunity to make a change. You do. So do it.",
    theme: 'theme-blues',
}

window.onload = (event) => {
    console.log('init sesh...');
    initSesh();
    initSettingsEventListener();
    initSetup();
    // getBookmarks();
};

function getBookmarks() {
    chrome.bookmarks.getTree(function(result) {
        //console.log(`results`, result);
        if(result && result[0]) {
            if(result[0].children) {
                let results = result[0].children;
                const bookmarksBar = results.filter(item => item.title === 'Bookmarks bar')[0];

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

                //console.log(`bookmarks bar`, bookmarksBar);
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
    console.log(`results`, searchResults);
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
            resultTitle.innerHTML = item.title;
            let resultLink = document.createElement("div");
            resultLink.className = "resultLink";
            resultLink.innerHTML = item.url;
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
        //bookmarkItem.innerHTML = item.title;
        // bookmarkItem.setAttribute("value", item.url);

        let connectorLeft = document.createElement("div");
        connectorLeft.className = `connectorLeft connector-to-${level}`;
        bookmarkItem.appendChild(connectorLeft);
        document.getElementById(`bookmarkLevel-${level}`).appendChild(bookmarkItem);

        let title = document.createElement("div");
        title.className = `itemTitle itemTitle-${level}`;
        title.innerHTML = item.title;
        bookmarkItem.appendChild(title);

        let connectorRight = document.createElement("div");
        connectorRight.className = `connectorRight connector-from-${level}`;
        bookmarkItem.appendChild(connectorRight);
        document.getElementById(`bookmarkLevel-${level}`).appendChild(bookmarkItem);

        bookmarkItem.addEventListener('click', (event)=>selectBookmark(event, level, item, index), false);
        bookmarkItem.addEventListener('dblclick', ()=>openLinks(item), false);
        bookmarkItem.addEventListener('contextmenu', (event)=>openRandomLink(event, item), false);
    });
}

function selectBookmark(event, level, item, index) {
    //console.log(`details`, item, index, item.children ? item.children.length : null);

    populateBookmarks(level+1, item.children);
    updateStatusBar(item);

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
    let itemContents = document.createElement("div");
    itemContents.className = "itemContents";
    if(item.url) {
        itemContents.innerHTML = `Type: Link`
    }
    else {
        const numFolders = item.children.filter(child => !child.url).length;
        const numLinks = item.children.filter(child => child.url).length;
        itemContents.innerHTML = `Type: Folder<br/>${numLinks} links, ${numFolders} folders`;
    }

    let itemDescription = document.createElement("div");
    let heading = document.createElement("div");
    let link = document.createElement("div");
    heading.className = "descriptionHeading";
    link.className="descriptionLink";
    itemDescription.className = "itemDescription";
    if(item.url) {
        heading.innerHTML = `${item.title}`;
        link.innerHTML = `${item.url}`;
        itemDescription.appendChild(heading);
        itemDescription.appendChild(link);
    }
    else {
        itemDescription.innerHTML = `${item.title}`;
    }

    let itemAction = document.createElement("div");
    itemAction.className= "itemAction";
    itemAction.innerHTML = item.url ? `Double click card to open link in new tab`
                                    : `Double click card to open all links in folder<br/>Right click to open a random link from the folder`;

    const bookmarksStatusBar = document.createElement("div");
    bookmarksStatusBar.id = "bookmarksStatusBar";
    bookmarksStatusBar.classList = "active";
    bookmarksStatusBar.appendChild(itemContents);
    bookmarksStatusBar.appendChild(itemDescription);
    bookmarksStatusBar.appendChild(itemAction);
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
        // selected = item.children[Math.floor(Math.random()*(item.children.length))];
        // console.log(`select int`, selected, counter);
        do {
            selected = item.children[Math.floor(Math.random()*(item.children.length - 1))];
            counter--;
            // console.log(`select int`, selected, counter);
        } while(!selected.url && counter>=0);
        if(!selected.url)
            return;
        // console.log(`random`, selected.url);
        window.open(selected.url);
    }
        
}


function initSettingsEventListener() {
    document.getElementById("settings").addEventListener('click', ()=>toggleSettingsScreen(true), false);
    document.getElementById("finish").addEventListener('click', ()=>finishSetup(), false);
}
function toggleSettingsScreen(flag) {
    if(flag) {
        document.getElementById("settingsContainer").classList.add('show');
        document.getElementById("settings").classList.remove('show');
    }
    else {
        document.getElementById("settingsContainer").classList.remove('show');
        document.getElementById("settings").classList.add('show');
    }
}

function preloadSettings(state) {
    //console.log(`preloading settings with`, state);
    const option = document.querySelector(`div[value=${state.mode}]`);
    if(option) {
        option.classList.add('active');
    }
    const theme = document.querySelector(`div[value=${state.theme}]`);
    if(theme) {
        theme.classList.add('active');
    }
    stateBuffer = state;
}

function initSesh() {
    fetchState();
}

function fetchState() {
    chrome.storage.local.get(['state'], function(result) {
        //console.log('Value currently is ', result.state);
        if(!result.state) {
            document.getElementById("settingsContainer").classList.add('show');
        }
        else {
            document.getElementById("seshParent").className = result.state.theme;
            loadApp(result.state);
        }
    });
    //chrome.storage.local.clear();
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
            timeContainer.innerHTML = moment().format('h:mma');
            document.getElementById("seshParent").appendChild(target);
            document.getElementById("dateTimeContainer").appendChild(timeContainer);
            setInterval(updateTime, 10000);
            break;
        }
        case 'date-time': {
            let target = document.createElement("div");
            target.id = "dateTimeContainer";
            let timeContainer = document.createElement("div");
            timeContainer.id = "timeContainer";
            timeContainer.innerHTML = moment().format('h:mma');
            let dateContainer = document.createElement("div");
            dateContainer.id = "dateContainer";
            dateContainer.innerHTML = moment().format('Do MMM, YYYY');
            document.getElementById("seshParent").appendChild(target);
            document.getElementById("dateTimeContainer").appendChild(timeContainer);
            document.getElementById("dateTimeContainer").appendChild(dateContainer);
            setInterval(updateTime, 10000);
            break;
        }
        case 'bookmarks': {
            let bookmarksContainer = document.createElement("div");
            bookmarksContainer.id = "bookmarksContainer";
            document.getElementById("seshParent").appendChild(bookmarksContainer);
            getBookmarks();
            break;
        }
        case 'nothing':
        default: {
            console.log(`doing nothing`);
        }
    }
    preloadSettings(state);
}

function updateTime() {
    let timeContainer = document.getElementById("timeContainer");
    if(timeContainer) {
        timeContainer.innerHTML = moment().format('h:mma');
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
    // console.log(`updating state`, mode);
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
    // console.log(`new state buffer`, stateBuffer);
}

function updateTheme(event) {
    let elements = document.getElementsByClassName("preview");
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
    }
    event.target.classList.add('active');
    const theme = event.target.getAttribute("value");
    // console.log(`updating theme`, theme);
    stateBuffer['theme'] = theme;
    document.getElementById("seshParent").className = theme;
}

function finishSetup() {
    // console.log(`will store`, stateBuffer);

    chrome.storage.local.set({"state": stateBuffer}, function() {
        clearCurrentDivs();
        loadApp(stateBuffer);
        toggleSettingsScreen(false);
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
}