import {readFileSync} from 'fs'

type Valve = { name: string, flow: number; paths: Array<string> };
const valveMap =
  readFileSync('./data.txt')
    .toString()
    .split('\n')
    .filter(line => !!line)
    .map(line => {
      // "Valve SU has flow rate=0; tunnels lead to valves NQ, RU"
      const match = /Valve (.*) has flow rate=(\d+); tunnels? leads? to valves? (.*)/.exec(line)
      return {
        name: match[1],
        flow: Number(match[2]),
        paths: match[3].split(', ')
      }
    }).reduce((m, node) => {
    m[node.name] = node
    return m
  }, {} as Record<string, Valve>)

// console.log(valveMap)


const cache = new Map<string, Array<[string, number]>>()

const locations = {
  me: 'AA',
  elephant: 'AA'
}
const LAST_MINUTE = 30
let totalFlowage = 0
const openValves = [] as Array<string>

for (let minute = 5; minute <= LAST_MINUTE; minute++) {

  console.log(`Minute ${minute}`)

  const steps = calcBestSteps(
    minute, locations.me, openValves)
  console.log({steps})

  const myStep = steps[0][0];

  const elephantStep =
    (locations.me == locations.elephant)
      ? (steps[1] || steps[0])[0] // maybe just one choice-- find it
      : calcBestSteps(
        minute, locations.elephant, openValves)[0][0]

  executeStep(minute, myStep, valveMap[locations.me], 'me');
  executeStep(minute, elephantStep, valveMap[locations.elephant], 'elephant');


}

function executeStep(minute: number, step, valve, who) {
  if (step == 'OPEN') {
    console.log(`  ${who} opens the valve ${valve.name} at flow rate ${valve.flow} for a win of ${valve.flow * (LAST_MINUTE - minute)}`)
    openValves.push(valve.name)
    totalFlowage += valve.flow * (LAST_MINUTE - minute)
  } else {
    console.log(`  ${who} moving to ${step}`)
    locations[who] = step
  }
}


console.log('**** TOTAL FLOWAGE: ', totalFlowage, '(want 1651 [p1] or 1707 [p2])')

function calcBestSteps(
  minute: number,
  whereWeAre: string,
  opened: Array<string>): Array<[string, number]> {

  // console.log({name: 'calcBestSteps', minute, whereWeAre, opened})
  if (minute > LAST_MINUTE) return [['?', 0]]

  const cacheKey = `${minute} ${whereWeAre} ${opened.join(',')}`
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const valve = valveMap[whereWeAre]

  // What we might get if we don't open the valve
  const tuples = valve.paths
    .map(path => {
      const score = calcBestSteps(
        minute + 1,
        path,
        [...opened])[0][1]
      return [path, score]
    }) as Array<[string, number]>

  if (!opened.includes(valve.name) && valve.flow > 0) {

    // take a minute to open the valve
    const score =
      calcBestSteps(
        minute + 1,
        whereWeAre, // not moving
        [...opened, whereWeAre])[0][1]

    tuples.push(['OPEN', score + valve.flow * (LAST_MINUTE - minute)])
  }
  // reverse sort by score
  tuples
    .sort((a, b) => (b[1] - a[1]))


  cache.set(cacheKey, tuples.slice(0, 2))
  return tuples.slice(0, 2)
}
