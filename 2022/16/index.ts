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


const cache = new Map<string, [string, number]>()

let here = 'AA'
const LAST_MINUTE = 30
let totalFlowage = 0
const openValves = [] as Array<string>

for (let minute = 1; minute <= LAST_MINUTE; minute++) {
  const valve = valveMap[here]

  console.log(`Minute ${minute} @ ${here}`)

  const [step] = calcBestStep(
    minute, here, openValves)

  if (step == 'OPEN') {
    console.log(`  Open the valve ${here} at flow rate ${valve.flow} for a win of ${valve.flow * (LAST_MINUTE - minute)}`)
    openValves.push(here)
    totalFlowage += valve.flow * (LAST_MINUTE - minute)
  } else {
    console.log(`  Moving to ${step}`)
    here = step
  }
}

console.log('**** TOTAL FLOWAGE: ', totalFlowage, '(want 1651)')

function calcBestStep(
  minute: number,
  whereWeAre: string,
  opened: Array<string>): [string, number] {

  if (minute > LAST_MINUTE) return ['?', 0]

  const cacheKey = `${minute} ${whereWeAre} ${opened.join(',')}`
  if (cache.has(cacheKey)) {
    // console.log('pulling from cache', cacheKey)
    return cache.get(cacheKey)
  }

  const valve = valveMap[whereWeAre]

  let bestScore = -1
  let bestStep = ''

  // What we might get if we don't open the valve
  valve.paths.forEach(path => {
    const [step, score] =
      calcBestStep(
        minute + 1,
        path,
        [...opened])
    if (score > bestScore) {
      bestStep = path
      bestScore = score
    }
  })

  if (!opened.includes(valve.name) && valve.flow > 0) {

    // take a minute to open the valve
    let [_, score] =
      calcBestStep(
        minute + 1,
        whereWeAre, // not moving
        [...opened, whereWeAre])
    score += valve.flow * (LAST_MINUTE - minute)
    if (score > bestScore) {
      bestStep = 'OPEN'
      bestScore = score
    }
  }
  cache.set(cacheKey, [bestStep, bestScore])
  return [bestStep, bestScore]
}
