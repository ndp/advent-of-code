import {asScoord, Scoord, scoordColumn, scoordRow} from "./scoord";

export enum Direction {
  N,
  S,
  W,
  E,
  Max
}

const cache = {}

export class Grove {

  elves: Set<Scoord>

  constructor(scan: string) {
    this.elves = new Set()
    scan
      .split('\n')
      .filter(line => line.length > 0)
      .forEach((line, row) => {
        line
          .split('')
          .forEach((ch, column) => {
            if (ch === '#')
              this.elves.add(asScoord({row, column}))
          })
      })
  }

  draw() {
    let map = ''
    for (let r = this.top; r <= this.bottom; r++) {
      for (let c = this.left; c <= this.right; c++)
        map += this.elfAt(asScoord({row: r, column: c})) ? '#' : '.'
      map += '\n'
    }
    return map
  }

  round(direction: Direction): boolean {
    // First half
    const potentials = this.potentialMoves(direction);

    const destinationCounts = potentials.reduce((h, [_, dest]) => {
      h[dest] = (h[dest] || 0) + 1
      return h
    }, {})

    // Second half, resolve positions
    const actualMoves = potentials
      .map(
        ([from, dest]) =>
          [from, destinationCounts[dest] > 1 ? from : dest])

    let movedOne = false
    actualMoves
      .forEach(([from, dest]) => {
        if (from !== dest) {
          movedOne = true
          this.elves.delete(from)
          this.elves.add(dest)
        }
      })
    return !movedOne
  }

  emptyGroundTiles() {
    return (this.bottom - this.top + 1) * (this.right - this.left + 1) - this.elves.size
  }

  potentialMoves(startingDirection: Direction): Array<[Scoord, Scoord]> {
    return [...this.elves]
      .map(elf => {

        // "If no other Elves are in one of those eight positions,
        // the Elf does not do anything during this round..."
        if (this.emptyInAllDirections(elf)) return [elf, elf]

        let direction = startingDirection
        do {
          if (this.emptyInDirection(elf, direction))
            return [elf, this.move(elf, direction)]
          direction = (direction + 1) % Direction.Max
        } while (direction !== startingDirection)

        return [elf, elf] // stay put
      })
  }

  emptyInDirection(coord: Scoord, dir: Direction) {
    return this.threeCoordsFrom(coord, dir).every(c => !this.elfAt(c))
  }

  emptyInAllDirections(coord: Scoord) {
    return this.emptyInDirection(coord, Direction.N)
      && this.emptyInDirection(coord, Direction.S)
      && this.emptyInDirection(coord, Direction.E)
      && this.emptyInDirection(coord, Direction.W)
  }

  move(coord: Scoord, dir: Direction) {
    const baseRow = scoordRow(coord)
    const baseColumn = scoordColumn(coord)

    if (dir === Direction.N || dir === Direction.S) {
      return asScoord({row: baseRow + (dir === Direction.N ? -1 : 1), column: baseColumn})
    }
    if (dir === Direction.W || dir === Direction.E) {
      return asScoord({row: baseRow, column: baseColumn + (dir == Direction.W ? -1 : 1)})
    }
    throw "Unrecognized direction"
  }


  threeCoordsFrom(coord: Scoord, dir: Direction) {

    const cacheKey = `${coord}/${dir}`
    if (cache[cacheKey]) return cache[cacheKey]

    const baseRow = scoordRow(coord)
    const baseColumn = scoordColumn(coord)

    const result = [-1, 0, 1]
      .map(offset =>
        (dir === Direction.N || dir === Direction.S)
          ? asScoord({row: baseRow + (dir === Direction.N ? -1 : 1), column: baseColumn + offset})
          : asScoord({row: baseRow + offset, column: baseColumn + (dir === Direction.W ? -1 : 1)})
      );
    cache[cacheKey] = result
    return result
  }

  get top() {
    return Math.min(...[...this.elves].map(scoordRow))
  }

  get bottom() {
    return Math.max(...[...this.elves].map(scoordRow))
  }

  get left() {
    return Math.min(...[...this.elves].map(scoordColumn))
  }

  get right() {
    return Math.max(...[...this.elves].map(scoordColumn))
  }

  elfAt(coord: Scoord) {
    return this.elves.has(coord)
  }
}
