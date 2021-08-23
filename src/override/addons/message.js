import { createElement } from '../utils.js'

export function loadMessage(message) {
    console.log(`loading message`)
    let target = createElement("messageContainer", "", "#seshParent")
    target.innerHTML = message
    //document.querySelector("#messageInput").setAttribute("value", state.message)
}

