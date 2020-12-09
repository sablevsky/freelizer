'use strict'

import { USER_MEDIA_CONSTRAINTS, FFT_SIZE } from './constants.js'
import { autoCorrelate } from './algorithm.js'
import { getNoteDataFromFrequency } from './helpers.js'

export const frequencyDetector = async () => {
  let rafID
  let audioContext
  let analyser
  let callbacks = []

  const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(
      USER_MEDIA_CONSTRAINTS
    )
    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = FFT_SIZE
    audioContext.createMediaStreamSource(stream).connect(analyser)
  }

  const update = () => {
    const buffer = new Float32Array(FFT_SIZE)
    analyser.getFloatTimeDomainData(buffer)
    const frequency = autoCorrelate(buffer, audioContext.sampleRate)
    callbacks.forEach((fn) => fn(getNoteDataFromFrequency(frequency || null)))
    rafID = requestAnimationFrame(update)
  }

  await init()

  return {
    start: () => update(),
    stop: () => cancelAnimationFrame(rafID),
    subscribe: (fn) => (callbacks = [...callbacks, fn]),
    unsubscribe: (fn) => (callbacks = callbacks.filter((el) => el !== fn)),
  }
}
