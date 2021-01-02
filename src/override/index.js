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
    });
}

function selectBookmark(event, level, item, index) {
    console.log(`details`, item, index, item.children ? item.children.length : null);

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
    const connectorHeight = item.children ? (index < item.children.length ? item.children.length*90 - 90 : (index+1)*90 - 90) : 0;
    connectorVertical.style.height = `${connectorHeight}px`;
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
    itemDescription.className = "itemDescription";
    if(item.url) {
        itemDescription.innerHTML = `${item.title}<br/>${item.url}`
    }
    else {
        itemDescription.innerHTML = `${item.title}`
    }

    let itemAction = document.createElement("div");
    itemAction.className= "itemAction";
    itemAction.innerHTML = item.url ? `Double click to open link in new tab`
                                    : `Double click to open all links in the folder`;

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