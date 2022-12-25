import * as assert from 'node:assert';
import {numberToSnafu, snafuToBigInt} from "./snafu";

[
  ['1=-0-2', '1747'],
  ['12111', '906'],
  ['2=0=', '198'],
  ['21', '11'],
  ['2=01', '201'],
  ['111', '31'],
  ['20012', '1257'],
  ['112', '32'],
  ['1=-1=', '353'],
  ['1-12', '107'],
  ['12', '7'],
  ['1=', '3'],
  ['122', '37']].forEach(([snafu, decimal]) => {
  assert.equal(snafuToBigInt(snafu), decimal)
  assert.equal(
    numberToSnafu(BigInt(decimal)),
    snafu,
    `Failed to convert ${decimal} (${Number(decimal).toString(5)}) to ${snafu}`)
});

[['1', '1'],
  ['2', '2'],
  ['3', '1='],
  ['4', '1-'],
  ['5', '10'],
  ['6', '11'],
  ['7', '12'],
  ['8', '2='],
  ['9', '2-'],
  ['10', '20'],
  ['15', '1=0'],
  ['20', '1-0'],
  ['2022', '1=11-2'],
  ['12345', '1-0---0'],
  ['314159265', '1121-1110-1=0']].forEach(([decimal, snafu]) => {

  assert.equal(snafuToBigInt(snafu), decimal)
  assert.equal(
    numberToSnafu(BigInt(decimal)),
    snafu,
    `Failed to convert ${decimal} (${Number(decimal).toString(5)}) to ${snafu}`)
})


