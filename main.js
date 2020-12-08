'use strict'

import { frequencyDetector } from './fd/index.js'
;(async function () {
  try {
    const { start, stop, subscribe } = await frequencyDetector()

    subscribe(console.log)

    document.querySelector('#start').addEventListener('click', start)
    document.querySelector('#stop').addEventListener('click', stop)
  } catch (error) {
    console.error(error)
  }
})()
