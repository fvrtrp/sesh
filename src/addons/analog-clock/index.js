import { createElement } from '../../utils.js'
import './index.scss'

const handWidth = 30, handHeight = 200
let minutesDiv = null, hoursDiv = null

export function loadTheme() {
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
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    return { minutes, hours }
}

function makeClock() {
    let clock = document.querySelector("#clock")
    if (clock) {
        clock.style.width = handWidth
        clock.style.height = handHeight
    }
    minutesDiv = createElement('handContainer-minutes', 'handContainer minutes', '#clock')
    createElement('', 'hand minutes', '#handContainer-minutes')

    hoursDiv = createElement('handContainer-hours', 'handContainer hours', '#clock')
    createElement('', 'hand hours', '#handContainer-hours')

    createElement('', 'pin', '#clock')
}

function updateDateTime() {
    const { minutes, hours } = getTime()
    const currentMinutes = minutesDiv.getAttribute('data-value')
    if (currentMinutes !== minutes) {
        minutesDiv.setAttribute('data-value', minutes);
        minutesDiv.style.transform = `translate(-50%, 0) rotate(${(-180 + minutes * 6)}deg)`;
    }
    const currentHours = hoursDiv.getAttribute('data-value')
    if (currentHours !== hours) {
        hoursDiv.style.transform = `translate(-50%, 0) rotate(${(-180 + hours * 30)}deg)`;
    }
}