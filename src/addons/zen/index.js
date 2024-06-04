import { createElement } from '../../utils.js'
import './index.scss'

export function loadTheme() {
    createElement("zenContainer", "", "#seshParent")
    document.querySelector("#seshParent").className = `theme-zen`
}

