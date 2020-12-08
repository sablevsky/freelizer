import { NOTES } from './constants.js'

const getNoteDataFromFrequency = (frequency) => {
  const noteNumber =
    Math.round(12 * (Math.log(frequency / 440) / Math.log(2))) + 69
  const noteIndex = noteNumber % 12
  const noteFrequency = 440 * 2 ** ((noteNumber - 69) / 12)
  return {
    frequency,
    note: NOTES[noteIndex],
    noteFrequency,
    deviation: frequency - noteFrequency,
  }
}

export { getNoteDataFromFrequency }
