import { createElement } from '../../utils.js'

export function loadTheme(message) {
    let target = createElement("messageContainer", "", "#seshParent")
    target.innerHTML = message
}