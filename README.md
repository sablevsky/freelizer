# Frequency detector
> Simple module on pure JavaScript with Audio Web API usage which was made for purpose of calculating sound frequency from microphone.

[Live example of usage](https://sablevsky.github.io/frequency-detector/)

## Data that library provides
1. Frequency of sound from microphone.
2. Nearest note letter that nearest to sound frequency.
3. Frequency of nearest note.
4. Octave number of nearest note.
5. Deviation between frequency of sound from microphone and frequency of nearest note.

## Usage example
```javascript
import { frequencyDetector } from './fd'

;(async function () {
    try {
      const { start, subscribe } = await frequencyDetector()
      start()
      subscribe(console.log)
    } catch (error) {
      // Error handling goes here
    }
})()
```

## A little explanation for usage example
Import ```frequencyDetector``` function
```javascript
import { frequencyDetector } from './fd'
```
Call ```frequencyDetector``` function. Beware, that ```frequencyDetector``` is asynchronous. It returns an object that contains functions. Call of ```frequencyDetector``` asks for permission of using microphone.
```javascript
const { start, subscribe } = await frequencyDetector()
```
Use ```start()``` function to launch process of sound listening.
```javascript
start()
```
Use ```subscribe()``` function that gets callback-function as argument. Callback-function will get data object as parameter. Callback will be called on each animation frame.
```javascript
subscribe(console.log)
```
Example of console output:
```javascript
{
  frequency: 163.71831025615992,
  note: "E",
  noteFrequency: 164.81377845643485,
  octave: 3,
  deviation: -1.0954682002749223,
}
```