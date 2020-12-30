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
};

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
        case 'bookmarks':
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

function initSetup() {
    let elements = document.getElementsByClassName("option");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', updateState, false);
    }
}

function updateStateBuffer(mode, value) {
    stateBuffer[mode] = value;
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
}