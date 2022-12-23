import {readFileSync} from 'fs'
import {Facing, State} from "./types";

const SAMPLE_INPUT =
  `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`

const INPUT = readFileSync('./data.txt').toString()

const MAP =
  INPUT
    .split("\n")
    .filter(line => line.length > 0)

let COMMANDS = MAP.pop()

console.log({MAP, COMMANDS})

const MAP_WIDTH = Math.max(...MAP.map(row => row.length))
const MAP_HEIGHT = MAP.length

let gState = {
  row: 0,
  column: leftMostOpenTile(MAP[0]),
  facing: Facing.right
}

let command


while (command = nextCommand()) {
  console.log(`Processing command ${command}`)

  gState = processCommand(gState, command)
}

console.log({facing: gState.facing, row: gState.row + 1, column: gState.column + 1})

function clockwise(facing: Facing) {
  if (facing == Facing.up)
    return Facing.right
  if (facing == Facing.right)
    return Facing.down
  if (facing == Facing.down)
    return Facing.left
  if (facing == Facing.left)
    return Facing.up
}

function counterClockwise(facing: Facing): Facing {
  return clockwise(clockwise(clockwise(facing)))
}

function rock({row, column}: { row: number, column: number }): boolean {
  return MAP[row][column] === '#'
}

function blank({row, column}: { row: number, column: number }): boolean {
  return MAP[row][column] === ' ' || MAP[row].length <= column
}

function calcNextPosition(facing: Facing, {
  row,
  column
}: { row: number, column: number }): { nextRow: number, nextColumn: number } {
// console.log('  ' , {facing, row, column})
  let nextColumn = column
  let nextRow = row

  if (facing == Facing.right)
    nextColumn = (column + 1) % MAP_WIDTH
  else if (facing == Facing.left)
    nextColumn = (column - 1 + MAP_WIDTH) % MAP_WIDTH
  else if (facing == Facing.up)
    nextRow = (row - 1 + MAP_HEIGHT) % MAP_HEIGHT
  else if (facing == Facing.down)
    nextRow = (row + 1) % MAP_HEIGHT

  if (blank({row: nextRow, column: nextColumn}))
    return calcNextPosition(facing, {row: nextRow, column: nextColumn})

  return {nextRow, nextColumn}
}

function moveCommand(state: State, steps: number): State {
  const {nextRow, nextColumn} = calcNextPosition(
    state.facing,
    {row: state.row, column: state.column})
// console.log('moveCommand: ', {steps, state})
  if (!rock({row: nextRow, column: nextColumn})) {
    const nextState = {...state, row: nextRow, column: nextColumn}
    if (steps > 1)
      return moveCommand(nextState, steps - 1)
    else
      return nextState
  } else
    return state
}


function processCommand(state: State, command: string): State {
  if (command == 'R') {
    return {
      ...state,
      facing: clockwise(state.facing)
    }
  }
  if (command == 'L') {
    return {
      ...state,
      facing: counterClockwise(state.facing)
    }
  }

  return moveCommand(state, Number(command))
}

function nextCommand() {
  const match = /^(\d+|R|L)/.exec(COMMANDS)
  if (!match) return ''
  COMMANDS = COMMANDS.substring(match[1].length)
  return match[1]
}

function leftMostOpenTile(s: string) {
  return s.indexOf('.')
}

// The final password is the sum of 1000 times the row, 4 times the column, and the facing.
function finalPassword(state: State) {
  return 1000 * (state.row + 1) + 4 * (state.column + 1) + state.facing
}

console.log({finalPassword: finalPassword(gState)})
console.log('Expected: final row is 6, thex final column is 8, and the final facing is 0.')
console.log('So, the final password is 1000 * 6 + 4 * 8 + 0: 6032.')
console.log('NOT: 170086, expected: 77318')
console.log({MAP_HEIGHT, MAP_WIDTH})

/*
        1111
        1111
        1111
        1111
222233334444
222233334444
222233334444
222233334444
        55556666
        55556666
        55556666
        55556666
 */
/*
You still start in the same position and with the same facing as before, but the wrapping rules are different. Now, if you would walk off the board, you instead proceed around the cube. From the perspective of the map, this can look a little strange. In the above example, if you are at A and move to the right, you would arrive at B facing down; if you are at C and move down, you would arrive at D facing up:

  ...#
.#..
#...
....
...#.......#
........#..A
  ..#....#....
.D........#.
...#..B.
.....#..
.#......
..C...#.
Walls still block your path, even if they are on a different face of the cube. If you are at E facing up, your movement is blocked by the wall marked by the arrow:

  ...#
.#..
-->#...
....
...#..E....#
........#...
..#....#....
..........#.
...#....
.....#..
.#......
......#.
Using the same method of drawing the last facing you had with an arrow on each tile you visit, the full path taken by the above example now looks like this:

>>v#
.#v.
#.v.
  ..v.
...#..^...v#
.>>>>>^.#.>>
.^#....#....
.^........#.
...#..v.
.....#v.
  .#v<<<<.
..v...#.
The final password is still calculated from your final position and facing from the perspective of the map. In this example, the final row is 5, the final column is 7, and the final facing is 3, so the final password is 1000 * 5 + 4 * 7 + 3 = 5031.

Fold the map into a cube, then follow the path given in the monkeys' notes. What is the final password?

*/
