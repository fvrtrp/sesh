import { createElement, loadStyle } from '../../utils.js'

export function loadTheme() {
    createElement("geometryContainer","", "#seshParent")
    const randomTheme = themes[Math.floor(Math.random()*themes.length)]
    loadCss(randomTheme)
}

function loadCss(theme) {
    loadStyle(`override/addons/geometry/index.css`)
    .then(() => {
        document.querySelector("#seshParent").className = `theme-geometry geometry-${theme}`
        initGeometry(theme)

    }).catch(err => alert(err))
}

const themes = [
    "blue",
    "red",
    "pink",
    "yellow",
    "green",
]

const palette = {
    "blue": ["#8C49FB", "#5234E5"],
    "red": ["#FF7B58", "#FF5A55"],
    "pink": ["#FF9DD8", "#FF76F2"],
    "yellow": ["#FFBC58", "#FFDF55"],
    "green": ["#40EE86", "#3FA26C"],
}

function initGeometry(theme) {
    const num = Math.floor(Math.random()*1) + 3
    for(let i=0; i<num; i++) {
        makeSquare(theme)
        makeCircle(theme)
        makeTriangle(theme)
    }
}

function makeTriangle(theme) {
    const windowHeight = window.innerHeight, windowWidth = window.innerWidth
    const square = createElement("square","square", "#geometryContainer")
    const size = Math.floor(Math.random()*50) + 50
    square.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`
    square.style.width = `${size}px`
    square.style.height = `${size}px`
    square.style.position = 'absolute'
    square.style.left = `${Math.floor(Math.random()*(windowWidth-200))}px`
    square.style.top = `${Math.floor(Math.random()*(windowHeight-200))}px`
    square.innerHTML = `<svg width="${size}" height="${size}" class="shape speed${Math.floor(Math.random()*3) + 2}">
    <defs>
        <radialGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: ${palette[theme][0]} ;stop-opacity:1" />
        <stop offset="100%" style="stop-color: ${palette[theme][1]} ;stop-opacity:1" />
        </radialGradient>
    </defs>
    <polygon points="0,0 ${size/2},${size} ${size},0" fill="url(#grad3)" />
</svg>`
}

function makeCircle(theme) {
    const windowHeight = window.innerHeight, windowWidth = window.innerWidth
    const square = createElement("square","square", "#geometryContainer")
    const size = Math.floor(Math.random()*50) + 50
    square.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`
    square.style.width = `${size}px`
    square.style.height = `${size}px`
    square.style.position = 'absolute'
    square.style.left = `${Math.floor(Math.random()*(windowWidth-200))}px`
    square.style.top = `${Math.floor(Math.random()*(windowHeight-200))}px`
    square.innerHTML = `<svg width="${size}" height="${size}" class="shape speed${Math.floor(Math.random()*3) + 2}">
    <defs>
        <radialGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: ${palette[theme][0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color: ${palette[theme][1]};stop-opacity:1" />
        </radialGradient>
    </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" stroke="black" stroke-width="0" fill="url(#grad3)" />
</svg>`
}

function makeSquare(theme) {
    const windowHeight = window.innerHeight, windowWidth = window.innerWidth
    const square = createElement("square","square", "#geometryContainer")
    const size = Math.floor(Math.random()*50) + 50
    square.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`
    square.style.width = `${size}px`
    square.style.height = `${size}px`
    square.style.position = 'absolute'
    square.style.left = `${Math.floor(Math.random()*(windowWidth-200))}px`
    square.style.top = `${Math.floor(Math.random()*(windowHeight-200))}px`
    square.innerHTML = `<svg width="${size}" height="${size}" class="shape speed${Math.floor(Math.random()*3) + 2}">
    <defs>
        <radialGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: ${palette[theme][0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color: ${palette[theme][1]};stop-opacity:1" />
        </radialGradient>
    </defs>
  <rect width="${size}" height="${size}" fill="url(#grad3)" style="stroke-width:0;stroke:rgb(0,0,0)" />
</svg>`
}

export function cleanup() {
    let container = document.getElementById("geometryContainer")
    if(container)   container.remove()
}