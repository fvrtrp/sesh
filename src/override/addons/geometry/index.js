import { createElement, loadStyle } from '../../utils.js'

export function loadGeometryTheme() {
    console.log(`loading geometry theme`)
    createElement("geometryContainer","", "#seshParent")
    //const randomTheme = themes[Math.floor(Math.random()*themes.length)]
    loadCss('blues')
}

function loadCss(theme) {
    loadStyle(`addons/vanilla-themes/${theme}.css`)
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
    const num = Math.floor(Math.random()*5) + 5
    for(let i=0; i<num; i++) {
        makeSquare()
    }
}

function makeSquare() {
    const windowHeight = window.innerHeight, windowWidth = window.innerWidth
    const square = createElement("square","", "#geometryContainer")
    const size = Math.floor(Math.random()*50) + 100
    square.style.transform = `rotate(${Math.floor(Math.random()*90)}deg)`
    square.style.width = `${size}px`
    square.style.height = `${size}px`
    square.style.position = 'absolute'
    square.style.left = `${Math.floor(Math.random()*(windowWidth-200))}px`
    square.style.top = `${Math.floor(Math.random()*(windowHeight-200))}px`
    square.innerHTML = `<svg width="${size}" height="${size}">
    <defs>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color: #322991;stop-opacity:1" />
      <stop offset="100%" style="stop-color: #6827C8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad3)" style="stroke-width:0;stroke:rgb(0,0,0)" />
</svg>`
}

export function cleanup() {
    console.log(`cleaning up geometry theme`)
    let container = document.getElementById("geometryContainer")
    if(container)   container.remove()
}