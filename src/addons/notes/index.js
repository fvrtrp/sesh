import { createElement, clearCurrentDivs, updateNotes } from '../../utils.js'
import './index.scss'

export function loadNotes(notes) {
    let container = document.querySelector('#notesContainer')
    if (container)
        container.remove()
    container = createElement('notesContainer', '', '#seshParent')
    const body = createElement('notesBody', '', '#notesContainer')

    let notesTitle = document.createElement('div')
    notesTitle.classList.add('notesTitle')
    notesTitle.innerHTML = 'Notes'
    body.appendChild(notesTitle)

    const noteValue = createElement('noteValue', '', '#notesBody', 'textarea')
    noteValue.value = notes.value
    noteValue.setAttribute('spellcheck', false)
    noteValue.addEventListener('input', (e) => {
        notes.value = e.target.value
        updateNotes(notes)
    })
    const noteToggle = createElement('noteToggle', '', '#notesContainer')
    noteToggle.innerHTML = '+'
    noteToggle.addEventListener('click', (e) => {
        toggleNotes(notes, !notes.show)
    })
    renderNotes(notes)
}

function toggleNotes(notes, show) {
    notes.show = show
    renderNotes(notes)
    updateNotes(notes)
}

function renderNotes(notes) {
    const notesBody = document.querySelector('#notesBody')
    const noteToggle = document.querySelector('#noteToggle')
    if (notes.show) {
        notesBody.classList.add('show')
        noteToggle.classList.add('show')
        noteToggle.title = "Hide"
    }
    else {
        notesBody.classList.remove('show')
        noteToggle.classList.remove('show')
        noteToggle.title = "Show notes"
    }
}

export function cleanup() {
    const notesContainer = document.querySelector("#notesContainer")
    if (notesContainer) notesContainer.remove()
}