import {readFileSync} from 'fs'

type Point = [number, number]
type Shape = Array<Point>
const SHAPES: Array<Shape> = [
  [[2, 2], [3, 2], [4, 2], [5, 2]], // ─
  [[3, 2], [2, 3], [3, 3], [4, 3], [3, 4]], // +
  [[4, 4], [4, 3], [2, 2], [3, 2], [4, 2]], //  ⎦  ⌟
  [[2, 5], [2, 4], [2, 3], [2, 2]], // |
  [[2, 2], [2, 3], [3, 2], [3, 3]] // ◼
]


class Chamber {
  shape: Shape
  wallHt = 0
  topOfRocks = 0

  constructor() {
    // start out with a floor
    this.shape = [[-1, -1], [0, -1], [1, -1], [2, -1], [3, -1], [4, -1], [5, -1], [6, -1], [7, -1]]
  }

  extendWallUpTo(newHt) {
    while (this.wallHt < newHt) {
      this.wallHt++
      this.shape.push([-1, this.wallHt])
      this.shape.push([7, this.wallHt])
    }
  }

  addStaticRock(sh: Shape) {
    this.shape.push(...sh)
    this.topOfRocks = Math.max(this.topOfRocks, topOfShape(sh) + 1)
  }

  bumps(sh: Shape): boolean {
    return sh.some(pt => intersects(this.shape, pt))
  }

  draw(fallingRock: Rock) {
    let top = Math.max(...this.shape.map(pt => pt[1]))
    for (let y = top; y >= 0; y--) {
      let line = ''
      for (let x = 0; x < 7; x++) {
        if (fallingRock && intersects(fallingRock.shape, [x, y]))
          line += '@'
        else if (intersects(this.shape, [x, y]))
          line += '#'
        else line += '.'
      }
      console.log(line)
    }

  }
}

function intersects(shape: Shape, pt: Point) {
  return shape.some(spt => spt[0] == pt[0] && spt[1] == pt[1])
}

function topOfShape(sh) {
  return Math.max(...sh.map(pt => pt[1]))
}

// chamber
// 7 units wide
/*
Each rock appears so that its left edge is two units away from the left wall and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).
 */
function add(s: Shape, offset: Point): Shape {
  return s.map(pt => [pt[0] + offset[0], pt[1] + offset[1]])
}

class Rock {
  shape: Shape

  constructor(readonly chamber: Chamber, height: number, shape) {
    this.shape = add(shape, [0, height + 1])
  }

  get left() {
    return Math.min(...this.shape.map(pt => pt[0]))
  }

  get right() {
    return Math.max(...this.shape.map(pt => pt[0]))
  }

  get top() {
    return topOfShape(this.shape)
  }

  get bottom() {
    return Math.min(...this.shape.map(pt => pt[1]))
  }

  push(dir: '<' | '>') {
    return this.moveIfPossible((dir === '<') ? [-1, 0] : [1, 0])
  }

  moveIfPossible(offset: Point) {
    const newShape = add(this.shape, offset)
    const bumps = this.chamber.bumps(newShape);
    if (bumps)
      return false
    this.shape = newShape
    return true
  }

  fall(): boolean {
    return this.moveIfPossible([0, -1])
  }
}

const breeze = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'.split('') as Array<'<' | '>'>
const xbreeze = readFileSync('./input.txt')
  .toString()
  .split('')
  .filter(s => s == '<' || s == '>') as Array<'<' | '>'>

const cycleLength = breeze.length * SHAPES.length
const targetRocks = 2022;//1000000000000

const log = (...args: any[]) => void {}

function part1({calcCycleStats, htPerCycle, rocksPerCycle}: {calcCycleStats: boolean, htPerCycle?: number, rocksPerCycle?: number}) {
  let rocksStopped = 0
  let fallingRock: Rock | null = null
  let i = 0
  const chamber = new Chamber()
  let lastRockCount = 0
  let lastTopOfRocks = 0
  let rocksAfterOneCycle = null
  let htAfterOneCycle = null

  while (rocksStopped < (cycleLength + cycleLength)) {

    if (calcCycleStats) {
      if (i % cycleLength == (cycleLength - 1)) {
        if (rocksAfterOneCycle == null) rocksAfterOneCycle = rocksStopped
        if (htAfterOneCycle == null) htAfterOneCycle = chamber.topOfRocks

        if (i>cycleLength){
          htPerCycle = chamber.topOfRocks - lastTopOfRocks;
          rocksPerCycle = rocksStopped - lastRockCount
          return { htPerCycle, rocksPerCycle}
        }

        lastTopOfRocks = chamber.topOfRocks
        lastRockCount = rocksStopped
      }

    } else {

    }

    const rockRemainder = targetRocks % rocksPerCycle
    if (rocksStopped == (rocksPerCycle + rockRemainder)) {
      const rocksRemaining = targetRocks - rocksStopped
      const cyclesLeft = Math.floor(rocksRemaining / rocksPerCycle)
      const extraRocks = rocksStopped - lastRockCount
      const extraHt = chamber.topOfRocks - lastTopOfRocks

      console.log('in cycle: ', {extraRocks, cyclesLeft, est: htAfterOneCycle + cyclesLeft * htPerCycle + extraHt})
    }

    if (!fallingRock) {
      fallingRock = new Rock(chamber, chamber.topOfRocks, SHAPES[rocksStopped % SHAPES.length])
      chamber.extendWallUpTo(fallingRock.top)
      log(`A new rock begins falling `, {
        i,
        rocksTop: chamber.topOfRocks,
        top: fallingRock.top,
        bottom: fallingRock.bottom
      })
      //chamber.draw(fallingRock)
    }

    // being pushed by a jet of hot gas
    const dir = breeze[i++ % breeze.length]
    if (fallingRock.push(dir))
      log('Jet of gas pushes rock')
    else
      log('Jet of gas pushes rock, but nothing happens ')
    //chamber.draw(fallingRock)

    //falling one unit down
    if (!fallingRock.fall()) {
      log(`Rock falls 1 unit, causing it to come to rest ${rocksStopped} top: ${fallingRock.top}`)
      // rock bumped into stuff
      rocksStopped++
      chamber.addStaticRock(fallingRock.shape)
      fallingRock = null
    } else
      log('Rock falls 1 unit')
    //chamber.draw(fallingRock)

  }
  return chamber.topOfRocks
}


const {htPerCycle, rocksPerCycle} = part1({calcCycleStats: true}) as {htPerCycle: number, rocksPerCycle: number}
console.log({htPerCycle, rocksPerCycle})
console.log('part1: ', part1({calcCycleStats: false, htPerCycle, rocksPerCycle}), ' expect 3068')
// 1531663350111 too low
// 1531663350130 too low
// 1535483870935 wrong
// 8543 13085 { heightDelta: 13085, rockDelta: 8543, projection: 1531663350111.2021 }
// x17068 26175 { heightDelta: 13090, rockDelta: 8525, projection: 1535483870935.1033 }
// 25593 39265 { heightDelta: 13090, rockDelta: 8525, projection: 1535483870935.1033 }
