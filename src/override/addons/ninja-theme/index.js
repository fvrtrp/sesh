import { loadStyle } from '../../utils.js'

export function loadNinjaTheme() {
    console.log(`loading ninja theme`)
    loadCss()
}

function loadCss() {
    loadStyle(`addons/ninja-theme/index.css`)
    .then(() => {
        document.querySelector("#seshParent").className = `theme-ninja`
    }).catch(err => alert(err))
}