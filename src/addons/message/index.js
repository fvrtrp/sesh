import { createElement } from '../../utils.js'
import './index.scss'

export function loadTheme(message) {
    createElement("messageContainer", "", "#seshParent")
    const target = createElement("messageInput", "", "#messageContainer")
    target.innerHTML = message
}