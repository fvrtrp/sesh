import { createElement } from '../../utils.js'
import { imageList } from './movie-list.js'
import './index.scss'

export function loadTheme() {
    document.querySelector("#seshParent").className = `theme-movies`
    createElement("vignetteBackground", "", "#seshParent")
    createElement("vignetteContainer", "", "#vignetteBackground")
    createElement("pictureContainer", "pictureContainer", "#vignetteBackground")
    createElement("", "picture", "#pictureContainer", "img")
    createElement("posterContainer", "posterContainer", "#vignetteBackground")
    const poster = createElement("poster", "picture", "#posterContainer", "img")
    createElement("movieTitle", "movieTitle", "#posterContainer")

    poster.addEventListener('mouseenter', () => toggleZoom(true))
    poster.addEventListener('mouseleave', () => toggleZoom(false))

    setTimeout(() => { setBackgroundAndText() }, 100)
}

let movieTitle = ""

function toggleZoom(flag) {
    if (flag) {
        document.querySelector('#posterContainer').classList.add('maximized')
        document.querySelector('#poster').classList.add('maximized')
        document.querySelector('.picture').classList.toggle('zoomedBackground')
    }
    else {
        document.querySelector('#posterContainer').classList.remove('maximized')
        document.querySelector('#poster').classList.remove('maximized')
        document.querySelector('.picture').classList.remove('zoomedBackground')
    }
}

function setBackgroundAndText() {
    const randomIndex = Math.floor(Math.random() * imageList.length)
    const randomItem = imageList[randomIndex]
    movieTitle = randomItem.title
    const link = randomItem.url
    const pictures = document.getElementsByClassName("picture")
    for (let item of pictures) {
        item.src = link;
    }
    document.querySelector('#movieTitle').style.visibility = 'initial'
    document.querySelector('#movieTitle').innerText = movieTitle
}

