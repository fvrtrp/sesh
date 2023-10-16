import { createElement } from '../../utils.js'

const handWidth = 30, handHeight = 200

export function loadAnalogClock() {
    createElement("dateTimeContainer", "", "#seshParent")
    let timeContainer = createElement("timeContainer", "", "#dateTimeContainer")
    // let dateContainer = createElement("dateContainer", "", "#dateTimeContainer")
    let clock = createElement("clock", "clock", "#dateTimeContainer")
    // clock.style.width = handHeight*2 + 'px'
    // clock.style.height = handHeight*2 + 'px'
    updateDateTime()
    //setInterval(updateDateTime, 5000)
}

function getDate() {
    const date = new Date()
    const formatted = `${date.getDate()}${nth(date.getDate())} ${date.toLocaleString('default', {month: 'short'})} , ${date.getFullYear()}`
    return formatted

    function nth(d) {
        if (d > 3 && d < 21) return 'th'
        switch (d % 10) {
          case 1:  return "st"
          case 2:  return "nd"
          case 3:  return "rd"
          default: return "th"
        }
    }
}

function getTime() {
    const date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes
    let strTime = hours + ':' + minutes + ampm
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
    // let dateContainer = document.querySelector("#dateContainer")
    // if(dateContainer) {
    //     dateContainer.innerHTML = getDate()
    // }
}

export function cleanup() {
    const dateTimeContainer = document.getElementById("dateTimeContainer")
    if(dateTimeContainer)
        dateTimeContainer.remove()
}