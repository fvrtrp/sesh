import { createElement } from '../utils.js'

export function loadMessage(message) {
    let target = createElement("messageContainer", "", "#seshParent")
    target.innerHTML = message
    //document.querySelector("#messageInput").setAttribute("value", state.message)
}

export function cleanup() {
    const messageContainer = document.getElementById("messageContainer")
    if(messageContainer)
        messageContainer.remove()
}