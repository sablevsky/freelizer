// Information sources:
// https://pages.mtu.edu/~suits/NoteFreqCalcs.html
// https://www.translatorscafe.com/unit-converter/en-US/calculator/note-frequency/
// https://guitardialogues.wordpress.com/

import { NOTES } from './constants.js'

const CONCERT_PITCH = 440 //frequency of a fixed note, which is used as a standard for tuning. It is usually a standard (also called concert) pitch of 440 Hz, which is called A440 or note A in the one-line (or fourth) octave (A4)
const MIDI = 69 // the MIDI note number of A4
const A = 2 ** (1 / 12) // the twelth root of 2 = the number which when multiplied by itself 12 times equals 2 = 1.059463094359...
const C0_PITCH = 16.35 // frequency of lowest note: C0

export default (frequency) => {
  const N = Math.round(12 * Math.log2(frequency / CONCERT_PITCH)) // the number of half steps away from the fixed note you are. If you are at a higher note, n is positive. If you are on a lower note, n is negative.
  const Fn = CONCERT_PITCH * A ** N // the frequency of the note n half steps away of concert pitch
  const noteIndex = (N + MIDI) % 12 // index of note letter from NOTES array
  const octave = Math.floor(Math.log2(Fn / C0_PITCH))

  return {
    frequency,
    note: NOTES[noteIndex],
    noteFrequency: Fn,
    deviation: frequency - Fn,
    octave,
  }
}
