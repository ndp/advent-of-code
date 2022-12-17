export type Point = [number, number]
export type Region = Array<Point>

export function ptInRegion(r: Region, pt: Point) {
  return r.some(spt => spt[0] == pt[0] && spt[1] == pt[1])
}

export function regionTop(sh) {
  return Math.max(...sh.map(pt => pt[1]))
}

export function regionBottom(region: Region) {
  return Math.min(...this.region.map(pt => pt[1]))
}

export function regionLeft(region: Region) {
  return Math.min(...region.map(pt => pt[0]))
}

export function regionRight(region: Region) {
  return Math.max(...region.map(pt => pt[0]))
}

export function offsetRegion(r: Region, offset: Point): Region {
  return r.map(pt => [pt[0] + offset[0], pt[1] + offset[1]])
}


