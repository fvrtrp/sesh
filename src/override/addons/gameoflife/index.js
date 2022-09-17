import { createElement, loadStyle } from '../../utils.js'

export function loadTheme() {
    console.log(`init gameoflife`)
    createElement("gameoflifeContainer","", "#seshParent")
    const randomTheme = themes[Math.floor(Math.random()*themes.length)]
    loadCss(randomTheme)
}

function loadCss(theme) {
    loadStyle(`addons/gameoflife/index.css`)
    .then(() => {
        document.querySelector("#seshParent").className = `theme-gameoflife gameoflife-${theme}`
        initGameoflife(theme)

    }).catch(err => alert(err))
}

const themes = [
    "blue",
    "red",
    "pink",
    "yellow",
    "green",
]

let gameState = [], size = 15, timeout = 200

function initGameoflife(theme) {
    const windowHeight = window.innerHeight, windowWidth = window.innerWidth
    const countX = Math.floor(windowWidth/size)+1, countY = Math.floor(windowHeight/size)+1

    //initialize values
    let arr = []
    for(let i=0; i<countY; i++) {
        const row = []
        for(let j=0; j<countX; j++) {
            const rand = Math.round(Math.random())
            if(rand) row.push(1)
            else row.push(0)
        }
        arr.push(row)
    }
    gameState = [...arr]

    //initialize board
    for(let i=0; i<countY; i++) {
        const row = gameState[i]
        createElement(`row-${i}`, "row", "#gameoflifeContainer")
        for(let j=0; j<countX; j++) {
            const val = row[j]
            const sq = createElement(`sq-${j}-row-${i}`, "sq", `#row-${i}`)
            sq.style.width = `${size}px`
            sq.style.height = `${size}px`
            if(val) sq.classList.add('active')
            else sq.classList.remove('active')
        }
    }
    
    // updateBoard()
    setInterval(nextFrame, timeout)
}

function updateBoard() {
    const countY = gameState.length
    for(let i=0; i<countY; i++) {
        const row = gameState[i]
        const countX = row.length
        // createElement(`row-${i}`, "row", "#gameoflifeContainer")
        for(let j=0; j<countX; j++) {
            const val = row[j]
            const sq = document.querySelector(`#sq-${j}-row-${i}`)
            if(val) sq.classList.add('active')
            else sq.classList.remove('active')
        }
    }
}

function nextFrame() {
    const arr = []
    const countY = gameState.length
    for(let i=0; i<countY; i++) {
        const row = []
        const countX = gameState[0].length
        createElement(`row-${i}`, "row", "#gameoflifeContainer")
        for(let j=0; j<countX; j++) {
            let val = gameState[i][j]
            
            const nl = gameState[i][j-1<0?countX-1:j-1]
            const ntl = gameState[i-1<0?countY-1:i-1][i-1<0?countX-1:i-1]
            const nt = gameState[i-1<0?countY-1:i-1][j]
            const ntr = gameState[i-1<0?countY-1:i-1][j+1===countX?0:j+1]
            const nr = gameState[i][j+1===countX?0:j+1]
            const nbr = gameState[i+1===countY?0:i+1][j+1===countX?0:j+1]
            const nb = gameState[i+1===countY?0:i+1][j]
            const nbl = gameState[i+1===countY?0:i+1][i-1<0?countX-1:i-1]

            const neighbors = [nl, ntl, nt, ntr, nr, nbr, nb, nbl].reduce((acc, i) => (i ? acc+1 : acc), 0)
            if(val) {
                if(neighbors!==2 && neighbors!==3) val = 0
                else val = 1
            }
            else {
                if(neighbors===3) val = 1
            }
            row.push(val)
        }
        arr.push(row)
    }
    gameState = [...arr]
    updateBoard()
}

export function cleanup() {
    clearInterval(nextFrame)
    console.log(`cleaning up gameoflife theme`)
    let container = document.getElementById("gameoflifeContainer")
    if(container)   container.remove()
}