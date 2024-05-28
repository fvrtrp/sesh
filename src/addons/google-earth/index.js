import './index.scss'
import { createElement } from '../../utils.js'
import { images } from './image-list.js'

export function loadTheme() {
    document.querySelector("#seshParent").className = `theme-googleearth`
    createElement("vignetteBackground", "", "#seshParent")
    createElement("vignetteContainer", "", "#vignetteBackground")
    createElement("pictureContainer", "pictureContainer", "#vignetteBackground")
    createElement("", "picture", "#pictureContainer", "img")

    setBackgroundAndText()
}

function setBackgroundAndText() {
    const randomId = Math.floor(Math.random() * images.length)
    const item = document.querySelector(".picture")
    item.src = `https://www.gstatic.com/prettyearth/assets/full/${images[randomId]}.jpg`
    setTimeout(() => document.querySelector('#pictureContainer').classList.add('active'), 10)
}

