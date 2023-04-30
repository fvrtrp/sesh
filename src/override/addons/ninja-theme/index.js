import { loadStyle } from '../../utils.js'

export function loadTheme() {
    loadCss()
}

function loadCss() {
    loadStyle(`override/addons/ninja-theme/index.css`)
    .then(() => {
        document.querySelector("#seshParent").className = `theme-ninja`
    }).catch(err => alert(err))
}