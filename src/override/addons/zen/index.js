import { createElement, loadStyle } from '../../utils.js'

export function loadTheme() {
    createElement("zenContainer","", "#seshParent")
    loadCss()
}


function loadCss() {
    loadStyle("override/addons/zen/index.css")
    .then(() => {
        document.querySelector("#seshParent").className = `theme-zen`
    }).catch(err => alert(err))
}

export function cleanup() {
    let container = document.getElementById("zenContainer")
    if(container)   container.remove()
}


