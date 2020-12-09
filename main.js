'use strict'

import { frequencyDetector } from './fd/index.js'

window.addEventListener('load', () => {
  const noteIconClasses = {
    up: 'note-up',
    down: 'note-down',
  }
  const noteElement = document.querySelector('#note')
  const frequencyElement = document.querySelector('#frequency')
  
  ;(async function () {
    try {
      const { start, subscribe } = await frequencyDetector()
      start()
  
      subscribe(({ frequency, note, deviation }) => {
        noteElement.textContent = note
        frequencyElement.textContent = frequency && `${frequency.toFixed(1)} Hz`
        noteElement.classList.remove(noteIconClasses.up, noteIconClasses.down)
        if (deviation >= 1.1) {
          noteElement.classList.add([noteIconClasses.up])
        } else if (deviation <= -1.1) {
          noteElement.classList.add([noteIconClasses.down])
        }
      })
    } catch (error) {
      console.error(error)
      alert(error)
    }
  })()
})


