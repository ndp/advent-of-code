import {readFileSync} from 'fs'


const lineRE = /Sensor at x=(?<sensorX>[0-9-]+), y=(?<sensorY>[0-9-]+): closest beacon is at x=(?<beaconX>[0-9-]+), y=(?<beaconY>[0-9-]+)/

const TEST = false
const MIN = 0
const MAX = TEST ? 20 : 4000000

const LINE = TEST ? 10 : 2000000

const readings = readFileSync(TEST ? './input-sample.txt' : './input.txt')
  .toString()
  .split('\n')
  .filter(line => !!line)
  .map(line => lineRE.exec(line).groups)
  .map(groups => ({
    sensor: {
      x: Number(groups.sensorX),
      y: Number(groups.sensorY)
    },
    beacon: {
      x: Number(groups.beaconX),
      y: Number(groups.beaconY)
    }
  })) as Reading[]

type Reading = {
  sensor: Point;
  beacon: Point
}
type Range = [number, number]
type Ranges = Array<Range>

function projectOntoLine(reading: Reading, line: number): null | Range {
  const dist = manhattenDistance(reading.sensor, reading.beacon)

  const vertDist = Math.abs(reading.sensor.y - line)

  // does not intersect our line
  if (dist < vertDist) return null

  const horzHalf = dist - vertDist

  const range = [reading.sensor.x - horzHalf, reading.sensor.x + horzHalf] as Range;
  return range
}

function calcRanges(readings, line: number): Ranges {
  const ranges = readings.map(reading => projectOntoLine(reading, line)).filter(x => !!x);
  return mergeIntervals(ranges)
    .filter(r => r[1] > MIN)
    .filter(r => r[0] < MAX)
    .map(r => [Math.max(MIN, r[0]), Math.min(MAX, r[1])])
}

function mergeIntervals(intervals) {
  if (intervals.length < 2) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);

  const result = [];
  let previous = intervals[0];

  for (let i = 1; i < intervals.length; i += 1) {
    if (previous[1] >= (intervals[i][0] - 1)) {
      previous = [previous[0], Math.max(previous[1], intervals[i][1])];
    } else {
      result.push(previous);
      previous = intervals[i];
    }
  }

  result.push(previous);

  return result;
}

const ranges = calcRanges(readings, LINE);
console.log(ranges)
const clearCells = ranges.reduce((total, range) => total + range[1] - range[0] + 1, 0);
console.log(clearCells)

const beacons = new Set(readings.filter(reading => reading.beacon.y === LINE).map(reading => reading.beacon.x)).size

console.log({clearCells, beacons, total: clearCells - beacons})

// Find the beacon (Part II)
console.log('Looking for beacons')
for (let line = MIN; line <= MAX; line++) {
  if (line % 100000 === 0) console.log(' ... on line ', line)
  const ranges = calcRanges(readings, line);
  if (ranges.length > 1) {
    const x = ranges[0][1] + 1
    const y = line
    console.log('TUNING FREQUENCY ', tuningFrequency({x, y}), {' at ': {x, y}, ranges})
    break;
  }
}

function tuningFrequency(p: Point) {
  const y = p.y.toString();
  const lastSix = y.slice(-6)
  const yOverflow = Number(Math.round(p.y / 1000000))
  console.log({y, lastSix, yOverflow, x: p.x})
  return `${p.x * 4 + yOverflow}${lastSix}`
}

type Point = {
  x: number
  y: number
}

function manhattenDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function testManhattenDistance() {
  console.log('0', manhattenDistance({x: 7, y: 9}, {x: 7, y: 9}))
  console.log('up 3', manhattenDistance({x: 7, y: 9}, {x: 7, y: 6}))
  console.log('dn 3', manhattenDistance({x: 7, y: 9}, {x: 7, y: 12}))
  console.log('lt 3', manhattenDistance({x: 7, y: 9}, {x: 4, y: 9}))
  console.log('rt 3', manhattenDistance({x: 7, y: 9}, {x: 10, y: 9}))
  console.log('diag 4', manhattenDistance({x: 7, y: 9}, {x: 9, y: 7}))
  console.log('diag 4 neg', manhattenDistance({x: -7, y: -9}, {x: -9, y: -7}))
}
