import { createElement } from '../../utils.js'

export function loadTheme() {
    createElement("zenContainer","", "#seshParent")
    document.querySelector("#seshParent").className = `theme-zen`
}

export function cleanup() {
    let container = document.getElementById("zenContainer")
    if(container)   container.remove()
}


