const fs = require('fs')
const sampleInput = fs.readFileSync('./instructions.txt').toString()
type Direction = 'U' | 'D' | 'L' | 'R'

const instructions = sampleInput
  .split('\n')
  .filter((line: string) => !!line)
  .map((line: string) => line.split(' '))
  .map(([dir, count]: [string,string]) => {
    let s = ''
    for (let i = 0; i < Number(count); i++)
      s += dir
    return s;
  })
  .join('')
  .split('') as Direction[]

type Coordinate = {
  x: number,
  y: number
}

const rope: Array<Coordinate> = [
  { x: 0, y: 0 }, // < -- HEAD
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 }  // < -- TAIL
]
const ROPE_TAIL_INDEX = rope.length - 1

const tailHistory: Set<string> = new Set()
recordHistory()

instructions.forEach(dir => {

  switch (dir) {
    case 'D': rope[0].y++; break;
    case 'U': rope[0].y--; break;
    case 'L': rope[0].x--; break;
    case 'R': rope[0].x++; break;
  }

  for (let i = 0; i < ROPE_TAIL_INDEX; i++)
    if (shouldMoveTail(i))
      moveTail(i)

  recordHistory()
})

console.log( { size: tailHistory.size, expected: 6271 })

function recordHistory() {
  tailHistory.add(`${rope[ROPE_TAIL_INDEX].x},${rope[ROPE_TAIL_INDEX].y}`)
}

function shouldMoveTail(i: number): boolean {
  return Math.abs(rope[i].x - rope[i + 1].x) > 1 ||
    Math.abs(rope[i].y - rope[i + 1].y) > 1
}

function moveTail(i: number) {
  if (rope[i].x == rope[i + 1].x)
    moveY()
  else if (rope[i].y == rope[i + 1].y)
    moveX()
  else {
    // diagonal requires a move in both directions
    moveX()
    moveY()
  }

  function moveY () {
    if (rope[i].y < rope[i + 1].y)
      rope[i + 1].y--
    else
      rope[i + 1].y++
  }

  function moveX () {
    if (rope[i].x < rope[i + 1].x)
      rope[i + 1].x--
    else
      rope[i + 1].x++
  }
}

