import { createElement } from '../../utils.js'

const handWidth = 30, handHeight = 200

export function loadAnalogClock() {
    createElement("dateTimeContainer", "", "#seshParent")
    createElement("clock", "clock", "#dateTimeContainer")
    makeClock()
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
    let clock = document.querySelector("#clock")
    if(clock) {
        clock.style.width = handWidth
        clock.style.height = handHeight
    }
    createElement('handContainer-minutes', 'handContainer minutes', '#clock')
    createElement('', 'hand minutes', '#handContainer-minutes')
    
    createElement('handContainer-hours', 'handContainer hours', '#clock')
    createElement('', 'hand hours', '#handContainer-hours')

    createElement('', 'pin', '#clock')
}

function updateDateTime() {
    const { minutes, hours } = getTime()
    const minutesDiv = document.querySelector('#handContainer-minutes')
    if(minutesDiv) {
        minutesDiv.style.transform = `translate(-50%, 0) rotate(${(-180+minutes*6)}deg)`;
    }
    const hoursDiv = document.querySelector('#handContainer-hours')
    if(hoursDiv) {
        hoursDiv.style.transform = `translate(-50%, 0) rotate(${(-180+hours*30)}deg)`;
    }
}

export function cleanup() {
    const dateTimeContainer = document.getElementById("dateTimeContainer")
    if(dateTimeContainer)
        dateTimeContainer.remove()
}