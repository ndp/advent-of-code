import {readFileSync} from 'fs'
import {ptInRegion, offsetRegion, Point, Region, regionBottom, regionLeft, regionRight, regionTop} from "./Region";

const SHAPES: Array<Region> = [
  [[2, 2], [3, 2], [4, 2], [5, 2]], // ─
  [[3, 2], [2, 3], [3, 3], [4, 3], [3, 4]], // +
  [[4, 4], [4, 3], [2, 2], [3, 2], [4, 2]], //  ⎦  ⌟
  [[2, 5], [2, 4], [2, 3], [2, 2]], // |
  [[2, 2], [2, 3], [3, 2], [3, 3]] // ◼
]


class Chamber {
  region: Region
  wallHt = 0
  topOfRocks = 0

  constructor() {
    // start out with a floor
    this.region = [[-1, -1], [0, -1], [1, -1], [2, -1], [3, -1], [4, -1], [5, -1], [6, -1], [7, -1]]
  }

  extendWallUpTo(newHt) {
    while (this.wallHt < newHt) {
      this.wallHt++
      this.region.push([-1, this.wallHt])
      this.region.push([7, this.wallHt])
    }
  }

  addStaticRock(sh: Region) {
    this.region.push(...sh)
    this.topOfRocks = Math.max(this.topOfRocks, regionTop(sh) + 1)
  }

  bumps(sh: Region): boolean {
    return sh.some(pt => ptInRegion(this.region, pt))
  }

  draw(fallingRock: Rock) {
    let top = Math.max(...this.region.map(pt => pt[1]))
    for (let y = top; y >= 0; y--) {
      let line = ''
      for (let x = 0; x < 7; x++) {
        if (fallingRock && ptInRegion(fallingRock.region, [x, y]))
          line += '@'
        else if (ptInRegion(this.region, [x, y]))
          line += '#'
        else line += '.'
      }
      console.log(line)
    }

  }
}


class Rock {
  region: Region

  constructor(readonly chamber: Chamber, height: number, region) {
    this.region = offsetRegion(region, [0, height + 1])
  }

  get left() {
    return regionLeft(this.region)
  }

  get right() {
    return regionRight(this.region)
  }

  get top() {
    return regionTop(this.region)
  }

  get bottom() {
    return regionBottom(this.region)
  }

  push(dir: '<' | '>') {
    return this.moveIfPossible((dir === '<') ? [-1, 0] : [1, 0])
  }

  moveIfPossible(ptOffset: Point) {
    const newShape = offsetRegion(this.region, ptOffset)
    const bumps = this.chamber.bumps(newShape);
    if (bumps)
      return false
    this.region = newShape
    return true
  }

  fall(): boolean {
    return this.moveIfPossible([0, -1])
  }
}

const sampleBreeze = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'.split('') as Array<'<' | '>'>
const breeze = readFileSync('./input.txt')
  .toString()
  .split('')
  .filter(s => s == '<' || s == '>') as Array<'<' | '>'>

const cycleLength = breeze.length * SHAPES.length
const targetRocks = 1000000000000 // 2022;//

function part1({
                 calcCycleStats,
                 htPerCycle,
                 rocksPerCycle
               }: { calcCycleStats: boolean, htPerCycle?: number, rocksPerCycle?: number }) {
  let rocksStopped = 0
  let fallingRock: Rock | null = null
  let i = 0
  const chamber = new Chamber()
  let lastRockCount = 0
  let lastTopOfRocks = 0
  let initialRockCount

  if (!calcCycleStats) {
    /*
      We have the cycle stats. We now need to figure out the
      precise "remainder" value. To do this, we work backwards
      from the end.
      target rocks = (some number of rocks in cycle) + initial
      the initial rocks will be
    */
    initialRockCount = targetRocks % rocksPerCycle + rocksPerCycle
  }


  while (rocksStopped < (cycleLength + cycleLength)) {

    if (calcCycleStats) {
      /*
        We don't know the height change for a cycle, so we
        run two cycles and then return it.
        We may not need to go so far in the cycle, but this
        seems safe, as things will definitely repeat after this much.
     */
      // Are we on our second cycle?
      if (i % cycleLength == (cycleLength - 1)) {
        if (i > cycleLength) {
          htPerCycle = chamber.topOfRocks - lastTopOfRocks;
          rocksPerCycle = rocksStopped - lastRockCount
          return {htPerCycle, rocksPerCycle}
        }

        lastTopOfRocks = chamber.topOfRocks
        lastRockCount = rocksStopped
      }

    } else {
      if (rocksStopped == initialRockCount) {
        const fullCycles = (targetRocks - initialRockCount) / rocksPerCycle
        const htWithinFullCycles = fullCycles * htPerCycle
        return htWithinFullCycles + chamber.topOfRocks
      }
    }

    // Here's the main simulation
    if (!fallingRock) {
      fallingRock = new Rock(chamber, chamber.topOfRocks, SHAPES[rocksStopped % SHAPES.length])
      chamber.extendWallUpTo(fallingRock.top)
    }

    // being pushed by a jet of hot gas
    const dir = breeze[i++ % breeze.length]
    fallingRock.push(dir)

    //falling one unit down
    if (!fallingRock.fall()) {
      rocksStopped++
      chamber.addStaticRock(fallingRock.region)
      fallingRock = null
    }
  }
  return chamber.topOfRocks
}


const {htPerCycle, rocksPerCycle} = part1({calcCycleStats: true}) as { htPerCycle: number, rocksPerCycle: number }
console.log({htPerCycle, rocksPerCycle})
console.log('part1: ', part1({calcCycleStats: false, htPerCycle, rocksPerCycle}), ' expect 3068 or 1514285714288')
// 1531663350130 too low
// 1535483870935 wrong
// 8543 13085 { heightDelta: 13085, rockDelta: 8543, projection: 1531663350111.2021 }
// x17068 26175 { heightDelta: 13090, rockDelta: 8525, projection: 1535483870935.1033 }
// 25593 39265 { heightDelta: 13090, rockDelta: 8525, projection: 1535483870935.1033 }
// Stats for real data:
// { htPerCycle: 13090, rocksPerCycle: 8525 }
