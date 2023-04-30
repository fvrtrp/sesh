import { loadStyle } from '../../utils.js'

export function loadTheme() {
    const randomTheme = themes[Math.floor(Math.random()*themes.length)]
    loadCss(randomTheme)
}

function loadCss(theme) {
    loadStyle(`override/addons/vanilla-themes/${theme}.css`)
    .then(() => {
        document.querySelector("#seshParent").className = `theme-${theme}`
    }).catch(err => alert(err))
}

const themes = [
    "blues",
    "autumn",
]