
export type Scoord = string // "String-coord", Javascript friendly

export function scoordRow(coord: Scoord): number {
  return parseInt(coord.split(',')[0])
}

export function scoordColumn(coord: Scoord): number {
  return parseInt(coord.split(',')[1])
}

export function asScoord({row,column}: {row: number, column: number}) {
  return `${row},${column}`
}
