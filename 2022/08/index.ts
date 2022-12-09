import * as fs from 'node:fs'

const inputStr = fs.readFileSync('./trees.txt').toString()

const grid: Array<Array<number>> =
  inputStr
    .split('\n')
    .filter(line => !!line)
    .map(line => line
      .split('')
      .map(ch => Number(ch)))
const eachCell = (fn: (r: number, c: number) => void) => {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      fn(r,c)
}
const column = (col: number) => grid.map(row => row[col])
// These return the values of the cells to the edge,
// in the indicated direction.
const leftOf = (row: number, col: number) => grid[row].slice(0, col).reverse()
const rightOf = (row: number, col: number) => grid[row].slice(col + 1)
const above = (row: number, col: number) => column(col).slice(0, row).reverse()
const below = (row: number, col: number) => column(col).slice(row + 1)


// Part I
let visibleCount = 0
eachCell((r,c) => {
  if (isVisible(r, c)) visibleCount++
})

console.log({ visibleCount, hiddenCount: (grid.length * grid[0].length - visibleCount), expected: 1679 })

// Part II
const scenicScores: Array<number> = []
eachCell((r,c)=> scenicScores.push(scenicScore(r, c)))

console.log({ maxScenicScore: Math.max(...scenicScores), expected: 536625 })



///////////   BIDNESS LOGIC  ///////////////

function isVisible (row: number, col: number): boolean {
  const value = grid[row][col]
  const isShorter = (v: number) => v < value
  return leftOf(row, col).every(isShorter) ||
    rightOf(row, col).every(isShorter) ||
    above(row, col).every(isShorter) ||
    below(row, col).every(isShorter)
}

function scenicScore (row: number, col: number): number {
  const value = grid[row][col]
  return [leftOf, rightOf, above, below]  // looking all directions...
    .map(fn => fn(row, col)) //  ... get an array of trees
    .map(trees => numVisibleFrom(value, trees)) // count how many are visible
    .reduce((a, e) => a * e) // ... and multiply all values together to get a score
}

// 1D function for "looking" for trees. The treehouse is at `viewpoint`, and the
// trees in that direction is `trees`.
// Returns the number of tree per the spec.
function numVisibleFrom (viewpoint: number, trees: number[]): number {
  // spec: "stop at the first tree that is the same height or taller than the tree under consideration"
  for (let i = 0; i < trees.length; i++)
    if (trees[i] >= viewpoint)
      return i + 1
  return trees.length // spec: "stop if you reach an edge"
}


