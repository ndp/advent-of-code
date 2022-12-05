import * as fs from 'fs'

// Types
type Yard = Record<StackIndex, Stack>
type StackIndex = string
type Stack = Array<Crate>
type Crate = string

type Queue = Array<Move>
type Move = {
  from: StackIndex
  to: StackIndex
  count: number
}

// A crane, at its core, executes moves
type Crane = (yard: Yard, move: Move) => void

// There are two models of cranes:
// 1. Crane that moves one at a time
const CrateMover9000: Crane = (yard: Yard, { from, to, count }: Move) => {
  while (--count >= 0) {
    const crate = yard[from].pop() as Crate
    yard[to].push(crate)
  }
}

// 2. Crane that moves a stack as a unit (part II)
const CrateMover9001: Crane = (yard: Yard, { from, to, count }: Move) => {
  const tempStack = []
  while (--count >= 0)
    tempStack.push(yard[from].pop() as Crate)
  while (tempStack.length)
    yard[to].push(tempStack.pop() as Crate)
}


const crane = CrateMover9001 // modify to get part i or part ii


const [yardData, queueData] = fs
  .readFileSync('./stacks-and-moves.txt')
  .toString()
  .split('\n\n')

const yard = makeYard(yardData)
const queue = makeQueue(queueData)

queue.forEach(move => crane(yard, move))

const topCrates = Object.keys(yard)
  .reduce((acc, label) => acc + yard[label].pop(), '')

console.log({ topCrates })


/****** DETAILS, DETAILS **************/
function makeQueue (queueData: string) {
  const queue: Queue = queueData.split('\n')
                                .filter(line => !!line)
                                .map(line => {
                                  const m = /move (\d+) from (\d) to (\d)/.exec(line)!
                                  return { count: Number(m[1]), from: m[2], to: m[3] }
                                })
  return queue
}

function makeYard (yardData: string) {
// read the yard
  const [stackLabelLine, ...crates] = yardData
    .split('\n')
    .reverse()

// set up the stacks...
  const yard = stackLabelLine
    .split(/\s+/)
    .filter(s => !!s)
    .reduce((stacks, index: StackIndex) => {
      stacks[index] = new Array() as Stack
      return stacks
    }, {} as Yard)

  // .... fill the stacks with containers
// start at the bottom
  const stackLabels = Object.keys(yard)
  crates.forEach(level => {
    for (let i = 0; i < stackLabels.length; i++) {
      // "[Z] [M] [P]" -- grab the letter from within the str
      const cr = level[4 * i + 1] as Crate
      if (cr?.trim())
        yard[stackLabels[i]].push(cr)
    }

  })

  return yard
}

