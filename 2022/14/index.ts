import {CaveMap} from "./caveMap";
import {readFileSync} from "fs";

const inputTest = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`

const input = readFileSync('./input.txt').toString()

// Part 1
const mapP1 = new CaveMap()
input
  .split('\n')
  .forEach(line => line
    .split(' -> ')
    .reduce((prev, pt) => {
      mapP1.addRockLine(prev, pt)
      return pt
    }))

while (mapP1.dropSand()) {
}
console.log(mapP1.draw())

// Part II
const mapP2 = new CaveMap()
mapP2.endlessVoid = false // only difference
input
  .split('\n')
  .forEach(line => line
    .split(' -> ')
    .reduce((prev, pt) => {
      mapP2.addRockLine(prev, pt)
      return pt
    }))

while (mapP2.dropSand()) {
}
console.log(mapP2.draw())
