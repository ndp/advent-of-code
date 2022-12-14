type Point = [number, number]
type PointStr = string

export class CaveMap {

  rocks: Set<PointStr> = new Set()
  sand: Set<PointStr> = new Set()
  _maxY = 0
  endlessVoid = true

  addRockLine(aStr: PointStr, bStr: PointStr) {
    this.addRock(aStr)
    this.addRock(bStr)
    const a = toPoint(aStr)
    const b = toPoint(bStr)
    const Xs = [a[0], b[0]].sort(numberSort)
    const Ys = [a[1], b[1]].sort(numberSort)

    for (let x = Xs[0]; x <= Xs[1]; x++)
      for (let y = Ys[0]; y <= Ys[1]; y++)
        this.addRock([x, y]);

    this._maxY = undefined // reset cache
  }

  private addRock(p: Point | PointStr) {
    this.rocks.add(asPointStr(p))
  }

  get rockBottom(): number {
    if (!this._maxY) {
      const Ys = this.rockPts.map(p => p[1]);
      this._maxY = Math.max(...Ys)
    }

    return this._maxY
  }

  get rockPts() {
    return [...this.rocks.values()].map(toPoint);
  }

  draw() {
    const rockXs = this.rockPts.map(p => p[0]);
    const sandXs = [...this.sand.values()].map(toPoint).map(p => p[0])
    const minX = Math.min(...rockXs, ...sandXs)
    const maxX = Math.max(...rockXs, ...sandXs)
    const minY = 0
    const maxY = this.rockBottom

    let out = ''
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x < maxX; x++)
        out += this.rocks.has(toPointStr([x, y])) ? '#' :
          this.sand.has(toPointStr([x, y])) ? 'o' : '.'
      out += '\n'
    }
    out += `*** Sand: ${this.sand.size} ***`
    return out
  }

  // Return "true" if it lands OK
  dropSand(pt: Point = [500, 0]): boolean {

    // For Part I, we need to check if we're dropping into a void
    if (this.endlessVoid && this.willFallIntoTheEndlessVoid(pt)) return false

    const directlyBelow = [pt[0], pt[1] + 1] as Point
    if (!this.isOccupied(directlyBelow))
      return this.dropSand(directlyBelow)

    const belowLeft = [pt[0] - 1, pt[1] + 1] as Point
    if (!this.isOccupied(belowLeft))
      return this.dropSand(belowLeft)

    const belowRight = [pt[0] + 1, pt[1] + 1] as Point
    if (!this.isOccupied(belowRight))
      return this.dropSand(belowRight)

    // This Sand is blocked and can fall no more-- place it!
    this.sand.add(toPointStr(pt))

    // If we are at the top, we're plugged up and must stop (Part II)
    return (pt[1] != 0)
  }

  willFallIntoTheEndlessVoid(pt: Point) {
    return pt[1] >= this.rockBottom
  }

  private isOccupied(pt: Point) {
    const s = toPointStr(pt)
    return pt[1] === (this.rockBottom + 2) // the part II floor
      || this.rocks.has(s) || this.sand.has(s);
  }
}


// Utilities
function numberSort(a, b) {
  return a - b
}

function toPoint(s: PointStr) {
  return s.split(',').map(s => Number(s)) as Point
}

function toPointStr(p: Point) {
  return `${p[0]},${p[1]}`
}

function asPointStr(p: Point | PointStr) : PointStr {
  if (Array.isArray(p))
    return toPointStr(p)
  return p
}
