export type Scoord = string // "String-coord", Javascript friendly

const cache = {}

function cachePoint(coord: Scoord) {
  const s = coord.split(',')
  const pt = {
    row: parseInt(s[0]),
    column: parseInt(s[1])};
  cache[coord] = pt
  return pt
}

export function scoordRow(coord: Scoord): number {
  return (cache[coord] || cachePoint(coord)).row
}

export function scoordColumn(coord: Scoord): number {
  return (cache[coord] || cachePoint(coord)).column
}

export function asScoord({row, column}: { row: number, column: number }) {
  return `${row},${column}`
}
