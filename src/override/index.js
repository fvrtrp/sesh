const initialState = {
    mode: "date-time",
    message: "The majority of people don't even get an opportunity to make a change. You do. So do it.",
}

window.onload = (event) => {
    console.log('init sesh...');
    initSesh();
};

function initSesh() {
    fetchState();
}

function fetchState() {
    chrome.storage.local.set({"state": initialState}, function() {
        console.log('Value is set to ', initialState);
        chrome.storage.local.get(['state'], function(result) {
            console.log('Value currently is ', result.state);
            loadApp(result.state);
            });
        });
}
    
function loadApp(state) {
    switch(state.mode) {
        case 'message': {
            let target = document.createElement("div");
            target.id = "messageContainer";
            target.innerHTML = state.message;
            document.getElementById("seshParent").appendChild(target);
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
            setInterval(updateTime, 500);
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
            setInterval(updateTime, 500);
            return;
        }
        default: {
            console.log(`default case`);
        }
    }

    function updateTime() {
        let timeContainer = document.getElementById("timeContainer");
        if(timeContainer) {
            timeContainer.innerHTML = moment().format('h:mma');
        }
    }
}