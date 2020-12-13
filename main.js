'use strict'

import { freelizer } from './freelizer/index.js'

window.addEventListener('load', () => {
  const MEASUREMENT_LIMIT = 1
  const noteElement = document.querySelector('#note')
  const frequencyElement = document.querySelector('#frequency')
  const deviationElement = document.querySelector('#deviation')
  const octaveElement = document.querySelector('#octave')

  const deviationIcons = {
    up: 'arrow_drop_up',
    down: 'arrow_drop_down',
  }

  ;(async () => {
    try {
      const { start, subscribe } = await freelizer()
      start()

      subscribe(({ frequency, note, deviation, octave }) => {
        noteElement.textContent = note
        frequencyElement.textContent = frequency && `${frequency.toFixed(1)} Hz`
        octaveElement.textContent = octave
        deviationElement.textContent =
          deviation >= MEASUREMENT_LIMIT
            ? deviationIcons.up
            : deviation <= -MEASUREMENT_LIMIT
            ? deviationIcons.down
            : null
      })
    } catch (error) {
      console.error(error)
      alert(error)
    }
  })()
})
