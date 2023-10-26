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

    const gear = createElement('', 'gear', '#clock', 'svg')
    gear.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 95 95" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M34.532 12.4708L27.7633 5.16087C25.3064 6.29276 22.9639 7.63059 20.758 9.15225L23.7182 18.7142C24.6697 21.7877 21.7877 24.6697 18.7142 23.7182L9.04259 20.7241C7.50775 22.8913 6.15201 25.1943 4.99693 27.6115L12.4708 34.532C14.8316 36.718 13.7767 40.6549 10.6392 41.3676L0.616344 43.6445C0.494403 45.0242 0.432135 46.4211 0.432135 47.8325C0.432135 49.0901 0.481576 50.3362 0.578622 51.569L10.6392 53.8544C13.7767 54.5671 14.8316 58.504 12.4708 60.69L4.85115 67.7455C5.97394 70.1399 7.29293 72.4239 8.78742 74.577L18.7142 71.5038C21.7877 70.5523 24.6697 73.4344 23.7182 76.5078L20.6451 86.4346C22.7981 87.9291 25.0822 89.248 27.4766 90.3708L34.532 82.7512C36.718 80.3905 40.6549 81.4454 41.3676 84.5828L43.653 94.6432C44.8857 94.7403 46.1318 94.7897 47.3894 94.7897C48.8009 94.7897 50.1978 94.7275 51.5776 94.6055L53.8544 84.5828C54.5671 81.4454 58.504 80.3905 60.69 82.7512L67.6104 90.2249C70.0276 89.0698 72.3307 87.7141 74.4979 86.1792L71.5038 76.5078C70.5523 73.4344 73.4344 70.5523 76.5078 71.5038L86.0695 74.4639C87.5912 72.258 88.9291 69.9155 90.061 67.4586L82.7512 60.69C80.3905 58.504 81.4454 54.5671 84.5828 53.8544L94.192 51.6715C94.2944 50.4054 94.3466 49.125 94.3466 47.8325C94.3466 46.386 94.2812 44.9548 94.1532 43.5417L84.5828 41.3676C81.4454 40.6549 80.3905 36.718 82.7512 34.532L89.917 27.8968C88.7527 25.4173 87.3779 23.0563 85.8157 20.8367L76.5078 23.7182C73.4344 24.6697 70.5523 21.7877 71.5038 18.7142L74.3854 9.40631C72.1658 7.84409 69.8047 6.46931 67.3253 5.30498L60.69 12.4708C58.504 14.8316 54.5671 13.7767 53.8544 10.6392L51.6803 1.06866C50.2671 0.940642 48.8359 0.875237 47.3894 0.875237C46.0969 0.875237 44.8166 0.927454 43.5506 1.02989L41.3676 10.6392C40.6549 13.7767 36.718 14.8316 34.532 12.4708Z" fill="url(#paint0_radial_812_16)"/>
    <defs>
      <radialGradient id="paint0_radial_812_16" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(47.611 47.611) rotate(89.7623) scale(42.6114 42.6114)">
        <stop stop-color="#121212"/>
        <stop offset="1" stop-color="#373737"/>
      </radialGradient>
    </defs>
  </svg>`
  const pin = createElement('', 'pin', '#clock')
    // const clockHtml = `${hoursDiv}${minutesDiv}$${gear}`
    // return clockHtml
}

function updateDateTime() {
    const { minutes, hours } = getTime()
    console.log(`updating date time`, minutes, hours)
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