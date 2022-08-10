import { createElement, loadStyle } from '../../utils.js'

export function loadZenTheme() {
    console.log(`loading zen...`)
    createElement("zenContainer","", "#seshParent")
    loadCss()
}


function loadCss() {
    loadStyle("addons/zen/index.css")
    .then(() => {
        document.querySelector("#seshParent").className = `theme-zen`
        //createSvg()
    }).catch(err => alert(err))
}



