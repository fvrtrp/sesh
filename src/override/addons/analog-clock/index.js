import { createElement } from '../../utils.js'

const handWidth = 30, handHeight = 200

export function loadAnalogClock() {
    createElement("dateTimeContainer", "", "#seshParent")
    createElement("clock", "clock", "#dateTimeContainer")
    updateDateTime()
    setInterval(updateDateTime, 5000)
}

function getTime() {
    const date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes
    return { minutes , hours }
}

function makeClock() {
    const { minutes, hours } = getTime()
    const hoursDiv = `<div class="handContainer hours" style="transform: translate(-50%, 0) rotate(${(-180+hours*30)}deg);">
    <div class="hand hours"></div>
    </div>`
    const minutesDiv = `<div class="handContainer minutes" style="transform: translate(-50%, 0) rotate(${(-180+minutes*6)}deg);">
    <div class="hand minutes"></div>
    </div>
    `
    return { hoursDiv: hoursDiv, minutesDiv: minutesDiv }
}

function updateDateTime() {
    let clock = document.querySelector("#clock")
    if(clock) {
        const clockDiv = makeClock()
        clock.innerHTML = `${clockDiv.hoursDiv}${clockDiv.minutesDiv}`
        clock.style.width = handWidth
        clock.style.height = handHeight
    }
}

export function cleanup() {
    const dateTimeContainer = document.getElementById("dateTimeContainer")
    if(dateTimeContainer)
        dateTimeContainer.remove()
}