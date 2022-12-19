export class LavaScan {

  _cubesHashmap
  private _scanMins: [number, number, number];
  private _scanMaxs: [number, number, number];

  constructor(private readonly cubes) {
    this.clearCaches()
  }

  clearCaches() {
    this._cubesHashmap = undefined
    this._scanMins = undefined
    this._scanMaxs = undefined
  }

  adjacentNonLavaCubes(cube): Array<string> {
    return adjacentCubes(cube)
      .filter(a => !this.isLavaCube(a))
  }


  get cubesHashmap() {
    if (this._cubesHashmap === undefined) {
      this._cubesHashmap = this.cubes
        .reduce((acc, cube) => {
          acc[cube] = true
          return acc
        }, {} as Record<string, boolean>)
    }
    return this._cubesHashmap
  }

  isLavaCube(c): boolean {
    return this.cubesHashmap[c] || false
  }

  calcExposedSurfaces() {
    return this.cubes
      .map(cube =>
        this.adjacentNonLavaCubes(cube).length)
      .reduce((a, c) => a + c)
  }

  addTrappedBubblesToCubes() {
    // We find trapped bubbles, and then add them to the
    // lava. We need to iterate as pockets may be larger than
    // one cube, so we just loop until we've filled all the pockets.
    let bubbles;
    do {
      bubbles = this.trappedBubbleEdges
      this.cubes.push(...bubbles)
      this.clearCaches()
    } while (bubbles.length > 0)
  }

  get trappedBubbleEdges() {
    // Look for bubbles within the scan.
    return [...new Set<string>(
      this.cubes
        .flatMap(cube =>
          this.adjacentNonLavaCubes(cube))
    )]
      .filter(this.isTrappedBubble)
  }

  get scanMins() {
    if (this._scanMins === undefined) {
      this._scanMins = this.cubes
        .map(cubeToDims)
        .reduce((acc, cube) =>
          [
            Math.min(acc[0], cube[0]),
            Math.min(acc[1], cube[1]),
            Math.min(acc[2], cube[2])
          ])
    }
    return this._scanMins
  }

  get scanMaxs() {
    if (this._scanMaxs === undefined) {
      this._scanMaxs = this.cubes
        .map(cubeToDims)
        .reduce((acc, cube) =>
          [
            Math.max(acc[0], cube[0]),
            Math.max(acc[1], cube[1]),
            Math.max(acc[2], cube[2])
          ])
    }
    return this._scanMaxs
  }

  isOutsideScan = (cube) => {
    const dims = cubeToDims(cube)
    for (let d in dims)
      if (dims[d] < this.scanMins[d] || dims[d] > this.scanMaxs[d])
        return true

    return false
  }

  // isInsideScan(cube) {
  //   return !this.isOutsideScan(cube)
  // }

  isTrappedBubble = (cube) => {
    const checked = new Set()
    let toCheck = new Set([cube])
    if (cube == '2,2,5')
      console.log('isTrappedCube', cube, toCheck.size, 'outside', this.isOutsideScan(cube))
    while (true) {

      // if no more to check, return true
      if (toCheck.size === 0) return true

      // if any are outsideScan return false
      if ([...toCheck].some(this.isOutsideScan))
        return false;

      // We've checked them, remember that
      [...toCheck].forEach(c => checked.add(c))

      // Generate our new set to check
      toCheck = new Set(
        [...toCheck]
          .flatMap(c => this.adjacentNonLavaCubes(c))
          .filter(c => !checked.has(c)))
    }
  }

}


// Utilities

function cubeToDims(cube) {
  return cube.split(',').map(v => Number(v));
}

const ADJ_TRANSFORMS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
] as const

function adjacentCubes(cube): Array<string> {
  const cubeDims = cubeToDims(cube)

  return ADJ_TRANSFORMS
    .map(tr =>
      tr.map((tt, i) => String(tt + cubeDims[i]))
        .join(','))
}
