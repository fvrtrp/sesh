import { createElement } from '../../utils.js'
import './index.scss'

export function loadTheme(mode) {
  createElement("zenContainer", mode ? mode : "", "#seshParent")
  document.querySelector("#seshParent").className = "theme-zen"
}

