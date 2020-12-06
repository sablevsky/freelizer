const USER_MEDIA_CONSTRAINTS = {
  audio: {
    mandatory: {
      googEchoCancellation: 'false',
      googAutoGainControl: 'false',
      googNoiseSuppression: 'false',
      googHighpassFilter: 'false',
    },
    optional: [],
  },
}

const FFT_SIZE = 2048

let audioContext
let analyser = null

const init = () => {
  navigator.mediaDevices
    .getUserMedia(USER_MEDIA_CONSTRAINTS)
    .then((stream) => {
      audioContext = new AudioContext
      const mediaStreamSource = audioContext.createMediaStreamSource(stream)
      analyser = audioContext.createAnalyser()
      analyser.fftSize = FFT_SIZE
      mediaStreamSource.connect(analyser)
      update()
    })
    .catch((error) => console.error({ error }))
}

init()

function update() {
  const buffer = new Float32Array(FFT_SIZE)
  analyser.getFloatTimeDomainData(buffer)
  const frequency = autoCorrelate(buffer, audioContext.sampleRate)

  console.log(frequency)

  requestAnimationFrame(update)
}

function getNoteByFrequency(frequency) {
  const notes = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ]

  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2))
  return notes[(Math.round(noteNum) + 69) % 12]
}

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

function centsOffFromFrequency(pitch, note) {
  return Math.floor(
    (1200 * Math.log(pitch / frequencyFromNoteNumber(note))) / Math.log(2)
  )
}

// Implements the ACF2+ algorithm
// Original algorithm is taken from https://github.com/cwilso/PitchDetect
function autoCorrelate(buf, sampleRate) {
  // Not enough signal check
  const RMS = Math.sqrt(buf.reduce((acc, el) => acc + el ** 2, 0) / buf.length)
  if (RMS < 0.001) return -1

  const THRES = 0.2
  let r1 = 0
  let r2 = buf.length - 1
  for (let i = 0; i < buf.length / 2; ++i) {
    if (Math.abs(buf[i]) < THRES) {
      r1 = i
      break
    }
  }
  for (let i = 1; i < buf.length / 2; ++i) {
    if (Math.abs(buf[buf.length - i]) < THRES) {
      r2 = buf.length - i
      break
    }
  }

  const buf2 = buf.slice(r1, r2)
  const c = new Array(buf2.length).fill(0)
  for (let i = 0; i < buf2.length; ++i) {
    for (let j = 0; j < buf2.length - i; ++j) {
      c[i] = c[i] + buf2[j] * buf2[j + i]
    }
  }

  let d = 0
  for (; c[d] > c[d + 1]; ++d);

  let maxval = -1
  let maxpos = -1
  for (let i = d; i < buf2.length; ++i) {
    if (c[i] > maxval) {
      maxval = c[i]
      maxpos = i
    }
  }
  let T0 = maxpos

  let x1 = c[T0 - 1]
  let x2 = c[T0]
  let x3 = c[T0 + 1]
  let a = (x1 + x3 - 2 * x2) / 2
  let b = (x3 - x1) / 2

  return sampleRate / (a ? T0 - b / (2 * a) : T0)
}
