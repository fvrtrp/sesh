import { createElement, loadStyle } from '../../utils.js'
import { images } from './image-list.js'

const validRange = [1003, 7023]

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

let movieTitle = ""

function toggleZoom(flag) {
    if(flag) {
        document.querySelector('#posterContainer').classList.add('maximized')
        document.querySelector('#poster').classList.add('maximized')
        document.querySelector('.picture').classList.toggle('zoomedBackground')
        // document.querySelector('#pictureContainer').classList.add('noblur')
        // document.querySelector('#movieTitle').style.visibility = 'hidden'
    }
    else {
        document.querySelector('#posterContainer').classList.remove('maximized')
        document.querySelector('#poster').classList.remove('maximized')
        document.querySelector('.picture').classList.remove('zoomedBackground')
        // document.querySelector('#pictureContainer').classList.remove('noblur')
        // document.querySelector('#movieTitle').style.visibility = 'initial'
    }
}

function setBackgroundAndText() {
    const randomId = Math.floor(Math.random() * images.length)
    const pictures = document.getElementsByClassName("picture")
    for(let item of pictures){
        item.src = `https://www.gstatic.com/prettyearth/assets/full/${images[randomId]}.jpg`
    }
    // document.querySelector('#movieTitle').style.visibility = 'initial'
    // document.querySelector('#movieTitle').innerText = movieTitle
    //toggleZoom(true)
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
    container = document.getElementById("posterContainer")
    if(container)   container.remove()
}

