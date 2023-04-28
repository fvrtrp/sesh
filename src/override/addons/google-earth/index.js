import { createElement, loadStyle } from '../../utils.js'
import { images } from './image-list.js'

export function loadTheme() {
    console.log(`loading google earth`)
    loadCss()
}

function resumeLoading() {
    createElement("vignetteBackground","", "#seshParent")
    createElement("vignetteContainer","", "#vignetteBackground")
    createElement("pictureContainer","pictureContainer", "#vignetteBackground")
    createElement("","picture", "#pictureContainer", "img")

    setBackgroundAndText()
}

function loadCss() {
    loadStyle("addons/google-earth/index.css")
    .then(() => {
        document.querySelector("#seshParent").className = `theme-googleearth`
        resumeLoading()
    }).catch(err => alert(err))
}

function setBackgroundAndText() {
    const randomId = Math.floor(Math.random() * images.length)
    const item = document.querySelector(".picture")
    item.src = `https://www.gstatic.com/prettyearth/assets/full/${images[randomId]}.jpg`
}

// DO THIS
export function cleanup() {
    console.log(`cleaning up google earth`)
    let container = document.getElementById("vignetteBackground")
    if(container)   container.remove()
    container = document.getElementById("vignetteContainer")
    if(container)   container.remove()
    container = document.getElementById("pictureContainer")
    if(container)   container.remove()
}

