export function loadTheme() {
    const theme = themes[Math.floor(Math.random()*themes.length)]
    document.querySelector("#seshParent").className = `theme-${theme}`
}

const themes = [
    "blues",
    "autumn",
]