import { createElement, loadStyle } from '../../utils.js'

export function loadTheme() {
    console.log(`loading geometry theme`)
    createElement("geometryContainer","", "#seshParent")
    //const randomTheme = themes[Math.floor(Math.random()*themes.length)]
    loadCss('blues')
}

function loadCss(theme) {
    loadStyle(`addons/geometry/${theme}.css`)
    .then(() => {
        document.querySelector("#seshParent").className = `theme-${theme}`
        initGeometry()

    }).catch(err => alert(err))
}

const themes = [
    "blues",
    "autumn",
]

function initGeometry() {
    console.log(`init geometry`)
    const num = Math.floor(Math.random()*1) + 3
    for(let i=0; i<num; i++) {
        makeSquare()
        makeCircle()
        makeTriangle()
    }
}

function makeTriangle() {
    const windowHeight = window.innerHeight, windowWidth = window.innerWidth
    const square = createElement("square","", "#geometryContainer")
    const size = Math.floor(Math.random()*50) + 100
    square.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`
    square.style.width = `${size}px`
    square.style.height = `${size}px`
    square.style.position = 'absolute'
    square.style.left = `${Math.floor(Math.random()*(windowWidth-200))}px`
    square.style.top = `${Math.floor(Math.random()*(windowHeight-200))}px`
    square.innerHTML = `<svg width="${size}" height="${size}" class="shape speed${Math.floor(Math.random()*3) + 2}">
    <defs>
        <radialGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: #FF9DD8;stop-opacity:1" />
        <stop offset="100%" style="stop-color: #FF76F2;stop-opacity:1" />
        </radialGradient>
    </defs>
    <polygon points="0,0 ${size/2},${size} ${size},0" fill="url(#grad3)" />
</svg>`
}

function makeCircle() {
    const windowHeight = window.innerHeight, windowWidth = window.innerWidth
    const square = createElement("square","", "#geometryContainer")
    const size = Math.floor(Math.random()*50) + 100
    square.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`
    square.style.width = `${size}px`
    square.style.height = `${size}px`
    square.style.position = 'absolute'
    square.style.left = `${Math.floor(Math.random()*(windowWidth-200))}px`
    square.style.top = `${Math.floor(Math.random()*(windowHeight-200))}px`
    square.innerHTML = `<svg width="${size}" height="${size}" class="shape speed${Math.floor(Math.random()*3) + 2}">
    <defs>
        <radialGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: #FF9DD8;stop-opacity:1" />
        <stop offset="100%" style="stop-color: #FF76F2;stop-opacity:1" />
        </radialGradient>
    </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" stroke="black" stroke-width="0" fill="url(#grad3)" />
</svg>`
}

function makeSquare() {
    const windowHeight = window.innerHeight, windowWidth = window.innerWidth
    const square = createElement("square","", "#geometryContainer")
    const size = Math.floor(Math.random()*50) + 100
    square.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`
    square.style.width = `${size}px`
    square.style.height = `${size}px`
    square.style.position = 'absolute'
    square.style.left = `${Math.floor(Math.random()*(windowWidth-200))}px`
    square.style.top = `${Math.floor(Math.random()*(windowHeight-200))}px`
    square.innerHTML = `<svg width="${size}" height="${size}" class="shape speed${Math.floor(Math.random()*3) + 2}">
    <defs>
        <radialGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: #FF9DD8;stop-opacity:1" />
        <stop offset="100%" style="stop-color: #FF76F2;stop-opacity:1" />
        </radialGradient>
    </defs>
  <rect width="${size}" height="${size}" fill="url(#grad3)" style="stroke-width:0;stroke:rgb(0,0,0)" />
</svg>`
}

export function cleanup() {
    console.log(`cleaning up geometry theme`)
    let container = document.getElementById("geometryContainer")
    if(container)   container.remove()
}