import {readFileSync} from 'fs'

const sampleInput =
  `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`

// const input = sampleInput
const input = readFileSync('./grid.txt').toString()

type Height = string // letter
type Index = number
type Coordinate = { x: Index, y: Index }
type Path = Array<Coordinate>
type Grid = Array<Array<Height>>

const {grid, currentLoc} = readGrid(input)

console.log('should return single path', JSON.stringify(findPaths({x: 5, y: 2}, grid)))
const twoLong = findPaths({x: 4, y: 2}, grid).map(p => p.length);
console.log('2: ', JSON.stringify(twoLong))


const paths = findPaths(currentLoc, grid)
console.log(paths.map(p => p.length).sort())


function readGrid(input: string): { grid: Grid, currentLoc: Coordinate } {
  let currentLoc = null
  const grid = input
    .split('\n')
    .map(line => line.split(''))
    .map((row, y) =>
      row.map((ht, x) => {
        if (ht === 'S') {
          currentLoc = {x, y}
          return 'a'
        }
        return ht
      }))

  return {grid, currentLoc}
}

interface CellIsAccessibleParams {
  currentHt: Height;
  grid: Grid;
  cell: { x: number; y: number },
  visited: Array<string>
}

function cellIsAccessible({currentHt, cell, grid, visited}: CellIsAccessibleParams) {
  if (visited.includes(coordAsString(cell))) return false
  if (cell.y < 0 || cell.y >= grid.length) return false
  if (cell.x < 0 || cell.x >= grid[cell.y].length) return false

  let cellValue = grid[cell.y][cell.x]
  // console.log ( '    ' + currentHt + ' -> ? ' + cellValue)
  if (cellValue == 'E') cellValue = 'z'
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
  const htChange = ALPHABET.indexOf(cellValue) - ALPHABET.indexOf(currentHt)
  return (htChange <= 1) // htChange >= 0 &&
}

function coordAsString(loc: Coordinate) {
  return `${loc.x},${loc.y}`
}

function findPaths(
  loc: Coordinate,
  grid,
  visited: Array<string> = []): Array<Path> {

  const currentHt = grid[loc.y][loc.x]
  if (currentHt === 'E')
    return [[loc]]

  let paths = []

  const nextCells = [
    {x: loc.x, y: loc.y - 1},
    {x: loc.x, y: loc.y + 1},
    {x: loc.x + 1, y: loc.y},
    {x: loc.x - 1, y: loc.y}
  ].filter(cell => cellIsAccessible({currentHt, cell, grid, visited}))

  nextCells.forEach(cell => {
    //console.log(`from ${coordAsString(loc)} consider ${coordAsString(cell)} after ${visited.join('->')}`)
    findPaths(
      cell,
      grid,
      [...visited, coordAsString(loc)])
      .forEach(nextPath => paths.push([coordAsString(loc), ...nextPath]))
  })

  return paths
}
