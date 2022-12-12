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
type Coord = { x: Index, y: Index }
type CoordStr = string
type Path = Array<CoordStr>
type Grid = Array<Array<Height>>
type Links = Record<string, Array<string>>


const {grid, start, end} = readGrid(input)

console.log(`Trying to go from ${start} to ${end}`)

const links = calcLinks(grid, 'up');
const goingUp = dijkstra(start, node => node === end, links)
console.log({goingUp})

const linksDn = calcLinks(grid, 'dn');
const goingDown = dijkstra(
  end,
  (node) => gridValue(node) === 'a',
  linksDn)
console.log({goingDown})
process.exit(0)


function coordAsString(loc: Coord): CoordStr {
  return `${loc.x},${loc.y}`
}

function gridValue(node: CoordStr) {
  const [x, y] = node.split(',')
  return grid[y][x]
}


interface Params {
  currentHt: Height;
  cell: { x: number; y: number },
  dir: 'up' | 'dn'
}

function cellIsAccessible({currentHt, cell, dir}: Params) {
  if (cell.y < 0 || cell.y >= grid.length) return false
  if (cell.x < 0 || cell.x >= grid[cell.y].length) return false

  let destHt = grid[cell.y][cell.x]
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
  const htChange = dir == 'up' ?
    ALPHABET.indexOf(destHt) - ALPHABET.indexOf(currentHt) :
    ALPHABET.indexOf(currentHt) - ALPHABET.indexOf(destHt)
  return (htChange <= 1)
}


function readGrid(input: string): { grid: Grid, start: CoordStr, end: CoordStr } {
  let start = null
  let end = null
  const grid = input
    .split('\n')
    .map(line => line.split(''))
    .map((row, y) =>
      row.map((ht, x) => {
        if (ht === 'S') {
          start = coordAsString({x, y})
          return 'a'
        }
        if (ht === 'E') {
          end = coordAsString({x, y})
          return 'z'
        }
        return ht
      }))

  return {grid, start, end}
}


function calcLinks(grid: Grid, dir: 'up' | 'dn'): Links {
  const links: Links = {};

  function calcNexts(loc: { x: number; y: number }, dir: 'up' | 'dn'): Array<string> {
    let currentHt = grid[loc.y][loc.x]
    const nextCells = [
      {x: loc.x, y: loc.y - 1},
      {x: loc.x, y: loc.y + 1},
      {x: loc.x + 1, y: loc.y},
      {x: loc.x - 1, y: loc.y}
    ].filter(cell => cellIsAccessible({currentHt, cell, dir}))
    return nextCells.map(coordAsString)
  }

  for (let row = 0; row < grid.length; row++)
    for (let col = 0; col < grid[row].length; col++) {
      const loc = {x: col, y: row};
      const validNexts = calcNexts({x: col, y: row}, dir)
      links[coordAsString(loc)] = validNexts
    }

  return links
}


// https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/
function dijkstra(start: CoordStr, end: (n: CoordStr) => boolean, edges: Links): number {
  const unvisited = new Set(Object.keys(edges))
  const distance = {} as Record<CoordStr, number>

  distance[start] = 0
  while (unvisited.size) {

    const nearestUnvisitedNode =
      [...unvisited]
        .reduce((best, n) => {
          if (!distance.hasOwnProperty(n)) return best // no distance yet?
          if (!distance.hasOwnProperty(best)) return n // no best distance?
          return distance[n] < distance[best] ? n : best;
        }, unvisited[0])

    visit(nearestUnvisitedNode)

    if (end(nearestUnvisitedNode))
      return distance[nearestUnvisitedNode];
  }

  return Infinity

  function visit(node: CoordStr) {
    unvisited.delete(node)

    // we are visiting because we know we have the shortest path!
    const toHere = distance[node]

    // looking through all our links, replace any that are longer than through this node
    edges[node].forEach(n => {
      if (!distance.hasOwnProperty(n) ||
        (toHere + 1) < distance[n])
        distance[n] = toHere + 1
    })

  }


}
