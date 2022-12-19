// Copyright (c) 2022
import {readFileSync} from 'fs'
import {LavaScan} from "./LavaScan";

const cubes =
  readFileSync('./data.txt')
  // readFileSync('./data-sample.txt')
    .toString()
    .split('\n')
    .filter(line => !!line)

const scan = new LavaScan(cubes)

const exposedSides = scan.calcExposedSurfaces()

console.log({exposedSides, expectedSample: 64, expected: 3636})

// part ii
scan.addTrappedBubblesToCubes()
const exposedSides2 = scan.calcExposedSurfaces()

console.log({exposedSides2, expectedSample: 58, not: 1694, high: 2810})

