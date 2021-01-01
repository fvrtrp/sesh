const stateBuffer = {
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
        console.log(`results`, result);
        if(result && result[0]) {
            if(result[0].children) {
                let results = result[0].children;
                const bookmarksBar = results.filter(item => item.title === 'Bookmarks bar')[0];
                console.log(`bookmarks bar`, bookmarksBar);
                populateBookmarks(0, bookmarksBar.children);
            }
        }
    });
}

function populateBookmarks(level, bookmarks) {
    if(!bookmarks || bookmarks.length === 0)
        return;
    for(let i=level; i<level+10; i++) {
        let oldBookmarksLevel = document.getElementById(`bookmarkLevel-${i}`);
        if(oldBookmarksLevel)
            oldBookmarksLevel.remove();
    }
    let bookmarkLevel = document.createElement("div");
    bookmarkLevel.id = `bookmarkLevel-${level}`;
    bookmarkLevel.className = "bookmarkLevel";
    document.getElementById("bookmarksContainer").appendChild(bookmarkLevel);
    
    bookmarks.forEach((item, index) => {
        let bookmarkItem = document.createElement("div");
        bookmarkItem.id = `bookmark-${item.title}`;
        bookmarkItem.className = `bookmarkItem ${item.url ? `link` : `folder`}`;
        //bookmarkItem.innerHTML = item.title;
        bookmarkItem.setAttribute("value", item.url);

        let title = document.createElement("div");
        title.className = `itemTitle itemTitle-${level}`;
        title.innerHTML = item.title;
        bookmarkItem.appendChild(title);

        let connector = document.createElement("div");
        connector.className = `connector connector-from-${level}`;
        bookmarkItem.appendChild(connector);
        document.getElementById(`bookmarkLevel-${level}`).appendChild(bookmarkItem);

        bookmarkItem.addEventListener('click', (event)=>selectBookmark(event, level, item), false);
        if(item.url)
            bookmarkItem.addEventListener('dblclick', ()=>openLink(item.url), false);
    });
}

function selectBookmark(event, level, item) {
    console.log(`details`, event.target, item);
    populateBookmarks(level+1, item.children);

    let connectors = document.getElementsByClassName(`connector-from-${level}`);
    for (let i = 0; i < connectors.length; i++) {
        connectors[i].classList.remove('active');
    }
    let titles = document.getElementsByClassName(`itemTitle-${level}`);
    for (let i = 0; i < titles.length; i++) {
        titles[i].classList.remove('active');
    }
    event.target.classList.add('active');
    if(!item.url)
        event.target.parentElement.querySelector('.connector').classList.add('active');
}
function openLink(url) {
    window.open(url, "_blank");
}


function initSettingsEventListener() {
    document.getElementById("settings").addEventListener('click', ()=>toggleSettingsScreen(true), false);
    document.getElementById("finish").addEventListener('click', ()=>finishSetup(), false);
}
function toggleSettingsScreen(flag) {
    if(flag)
        document.getElementById("settingsContainer").classList.add('show');
    else
        document.getElementById("settingsContainer").classList.remove('show');
}

function initSesh() {
    fetchState();
}

function fetchState() {
    chrome.storage.local.get(['state'], function(result) {
        console.log('Value currently is ', result.state);
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
            return;
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
            return;
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
            return;
        }
        case 'bookmarks': {
            let bookmarksContainer = document.createElement("div");
            bookmarksContainer.id = "bookmarksContainer";
            document.getElementById("seshParent").appendChild(bookmarksContainer);
            getBookmarks();
            return;
        }
        case 'nothing':
        default: {
            console.log(`doing nothing`);
        }
    }
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