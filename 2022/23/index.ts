import {readFileSync} from 'fs'
import {Direction, Grove} from "./Grove";

const GROVE_SCAN =
  `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`


// const g = new Grove(GROVE_SCAN)
const g = new Grove(readFileSync('./scan.txt').toString())
console.log('== Initial State ==')
console.log(g.draw())
console.log()

for (let round = 0; round < 10000; round++) {
  console.log('== End of Round ', round+1, '  Direction: ', directionForRound(round))
  const isStatic = g.round(directionForRound(round))
  console.log(g.draw())
  console.log()
  if (isStatic) {
    console.log('NO MOVEMENT DETECTED')
    console.log('ROUND #', round + 1)
    break
  }
}

console.log('Empty ground tiles: ', g.emptyGroundTiles(), ' expect 110')

type Round = number

function directionForRound(r: Round): Direction {
  return r % Direction.Max
}


