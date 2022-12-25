import {readFileSync} from 'fs'
import * as assert from 'node:assert';
import {numberToSnafu, snafuToBigInt} from "./snafu";


const sample =
  readFileSync('./sample-input.txt')
    .toString()
    .split('\n')
    .filter(line => line.length > 0)
    .map(snafu => snafuToBigInt(snafu))
    .reduce((total, value) => total + value)

console.log({sample, snafu: numberToSnafu(sample), expected: '4890', expectedSnafu: '2=-1=0'})


const actual =
  readFileSync('./input.txt')
    .toString()
    .split('\n')
    .filter(line => line.length > 0)
    .map(snafu => snafuToBigInt(snafu))
    .reduce((total, value) => total + value)

console.log({actual, snafu: numberToSnafu(actual)})
