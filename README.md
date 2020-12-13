# Freelizer
> Simple package on pure JavaScript with Audio Web API usage that was made for purpose of calculating sound frequency from microphone.

[Live example of usage](https://sablevsky.github.io/freelizer/)

## Some important information
Has been tested only in desktop and mobile Google Chrome version 87.0. 
Package doesn't include polyfills. Stable work in other browsers isn't guaranteed.
Requires support of Web Audio API.
Has 0 dependencies from other packages.



## Data that library provides
1. Frequency of sound from microphone.
2. Nearest note letter that nearest to sound frequency.
3. Frequency of nearest note.
4. Octave number of nearest note.
5. Deviation between frequency of sound from microphone and frequency of nearest note.

## Usage example
```javascript
import { freelizer } from 'freelizer'

;(async function () {
    try {
      const { start, subscribe } = await freelizer()
      start()
      subscribe(console.log)
    } catch (error) {
      // Error handling goes here
    }
})()
```
## A little explanation for usage example
Import `freelizer` function
```javascript
import { freelizer } from 'freelizer'
```
Call `freelizer` function. Beware, that `freelizer` is asynchronous. It returns an object that contains functions. Call of `freelizer` asks for permission of using microphone.
```javascript
const { start, subscribe } = await freelizer()
```
Use `start()` function to launch process of sound listening.
```javascript
start()
```
Use `subscribe()` function that takes callback-function as argument. Callback-function will get data object as parameter. Callback will be called on each animation frame.
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
## `freelizer`
Asynchronous function that call returns an object that contains functions for library mainpulation. These functions are:
 * ```start()```
 * ```stop()```
 * ```subscribe()```
 * ```unsubscribe()```
### Calling example:
```javascript
const { start, stop, subscribe, unsubscribe } = await freelizer()
````
### Error handling
Since the function is asynchronous it recommended to use `try/catch` statement.
The most frequent cause of errors is situation when user blocks microphone usage. 
```javascript
try {
  const { start, subscribe } = await freelizer()
} catch (error) {
  // Error handling goes here
}
```
## `start`
Function that launch process of sound listening. During this process all functions-subscribers are called on each animation frame.
## `stop`
The opposite of `start` function. It stops process of sound listening.

## `subscribe`
Provides mechanism of subscription to sound listening stream.
It takes callback-function as argument. Callback-function will get data object as parameter. Callback will be called on each animation frame.
### Usage
```javascript
const callbackExample = data => console.log(data)
subscribe(callbackExample)
```
### Callback-function argument
Callback-function takes object that contains the following fileds:
* frequency: `Float Number`
* note: `String`
* noteFrequency: `Float Number`
* octave: `Integer Number`
* deviation: `Float Number`
```javascript
{
  frequency: 163.71831025615992,
  note: "E",
  noteFrequency: 164.81377845643485,
  octave: 3,
  deviation: -1.0954682002749223,
}
```
Its possible to subscribe as many functions as needed.
## `unsubscribe`
Unsubscribes callback-function from listening of stream.
Takes callback-function that previously was transmitted to `subscribe` function.
Remember that it doesn't work with annonymous functions.
### Usage
Example that logs data in console for 5 seconds:
```javascript
const { start, stop, subscribe, unsubscribe } = await freelizer()
start()
const callbackExample = (data) => console.log(data)
subscribe(callbackExample)
setTimeout(() => unsubscribe(callbackExample), 5000)
```
## Sources
### ACF2+ algorithm
Original algorithm that returns frequency value from waveform was taken from ["Simple pitch detection"](https://github.com/cwilso/PitchDetect) repository.
### Theory of music
- ["Equations for the Frequency Table"](https://pages.mtu.edu/~suits/NoteFreqCalcs.html)
- ["Musical Note Frequency Calculator"](https://www.translatorscafe.com/unit-converter/en-US/calculator/note-frequency/)
- ["guitardialogues"](https://guitardialogues.wordpress.com/)