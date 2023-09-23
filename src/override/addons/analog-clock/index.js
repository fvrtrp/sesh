import { createElement } from '../../utils.js'

export function loadAnalogClock() {
    createElement("dateTimeContainer", "", "#seshParent")
    let timeContainer = createElement("timeContainer", "", "#dateTimeContainer")
    // let dateContainer = createElement("dateContainer", "", "#dateTimeContainer")
    updateDateTime()
    setInterval(updateDateTime, 5000)
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
    const html = `<svg height="80" width="300" style="transform: rotate(${(-90+minutes*6)}deg); transform-origin: left; transition: transform 3s ease;">
    <g fill="none">
      <path stroke="red" d="M20 20 l215 0" stroke-linecap="round" stroke-width="25"/>
    </g>
  </svg>
  <svg height="80" width="300" style="transform: rotate(${(-90+hours*30)}deg); transform-origin: left;">
    <g fill="none">
      <path stroke="skyblue" d="M20 20 l100 0" stroke-linecap="round" stroke-width="25"/>
    </g>
  </svg>${hours} -- ${minutes}`
    return html
}

function updateDateTime() {
    let timeContainer = document.querySelector("#timeContainer")
    if(timeContainer) {
        timeContainer.innerHTML = makeClock()
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