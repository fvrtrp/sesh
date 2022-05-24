import { createElement, loadStyle } from '../../utils.js'

export function loadZenTheme() {
    console.log(`loading zen...`)
    createElement("zenContainer","", "#seshParent")
    loadCss()
}


function loadCss() {
    loadStyle("addons/zen/index.css")
    .then(() => {
        createSvg()
    }).catch(err => alert(err))
}

function createSvg() {
    const target = document.querySelector("#zenContainer")
    const styles = window.getComputedStyle(target)
    const divHeight = parseInt(styles["height"])
    const divWidth = parseInt(styles["width"])

    const verticalLineCount = parseInt(divWidth/50)
    const horizontalPadding = (divWidth - 50*verticalLineCount)/2
    const horizontalLineCount = parseInt(divHeight/50)
    const verticalPadding = (divHeight - 50*horizontalLineCount)/2

    console.log(`zzz zen`, divWidth, divHeight, horizontalPadding, verticalPadding)

    const graphic = `<svg height=${divHeight} width=${divWidth}>
    <g class="graphLines">
        ${(new Array(horizontalLineCount+1).fill(0).map((i, index) => (
            "<line class='graphLine horizontalLine' x1='0' x2="+divWidth+" y1="+(verticalPadding+index*50)+" y2="+(verticalPadding+index*50)+" />"
        )))}
        ${(new Array(verticalLineCount+1).fill(0).map((i, index) => (
            "<line class='graphLine verticalLine' x1="+(horizontalPadding+index*50)+" x2="+(horizontalPadding+index*50)+" y1='0' y2="+divHeight+" />"
        )))}
    </g>
    </svg>`

    target.innerHTML = graphic

}


