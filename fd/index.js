'use strict'

import { USER_MEDIA_CONSTRAINTS, FFT_SIZE } from './constants.js'
import { autoCorrelate } from './algorithm.js'
import { getNoteDataFromFrequency } from './helpers.js'

const init = ({ audioContext, analyser, rafID, callback }) => {
  return new Promise((resolve) => {
    navigator.mediaDevices
      .getUserMedia(USER_MEDIA_CONSTRAINTS)
      .then((stream) => {
        audioContext = new AudioContext()
        analyser = audioContext.createAnalyser()
        analyser.fftSize = FFT_SIZE
        audioContext.createMediaStreamSource(stream).connect(analyser)
        resolve({ audioContext, analyser, rafID, callback })
      })
      .catch((error) => console.error({ error }))
  })
}

const update = ({ audioContext, analyser, rafID, callback }) => {
  const buffer = new Float32Array(FFT_SIZE)
  analyser.getFloatTimeDomainData(buffer)
  const frequency = autoCorrelate(buffer, audioContext.sampleRate)
  frequency && callback(getNoteDataFromFrequency(frequency))
  rafID.value = requestAnimationFrame(
    update.bind(null, { audioContext, analyser, rafID, callback })
  )
}

const frequencyDetector = (callback) => {
  const rafID = {}
  let audioContext
  let analyser

  return [
    () => init({ audioContext, analyser, rafID, callback }),
    update,
    () => window.cancelAnimationFrame(rafID.value),
  ]
}

;(async function () {
  const [init, start, stop] = frequencyDetector(console.log)
  const res = await init()
  document.querySelector('#start').addEventListener('click', () => start(res))
  document.querySelector('#stop').addEventListener('click', stop)
})()
