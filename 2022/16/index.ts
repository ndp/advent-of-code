import {readFileSync} from 'fs'

type Valve = { name: string, flow: number; paths: Array<string> };
const valveMap =
  readFileSync('./sample-data.txt')
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


const cache = new Map<string, [number, Array<string>]>()

let here = 'AA'
const LAST_MINUTE = 30
let totalFlowage = 0
const openValves = [] as Array<string>

for (let minute = 1; minute <= LAST_MINUTE; minute++) {
  const valve = valveMap[here]

  console.log(`Minute ${minute} @ ${here}`)

  const [score, steps] = bestChoiceFor(
    minute,
    here,
    openValves,
    Math.min(LAST_MINUTE - minute, 29)
  )

  if (minute === 1)
    console.log({steps})

  if (steps[0] === 'OPEN') {
    console.log(`  Open the valve ${here} at flow rate ${valve.flow} for a win of ${valve.flow * (LAST_MINUTE - minute)}`)
    totalFlowage += valve.flow * (LAST_MINUTE - minute)
    openValves.push(here)

    minute++
    console.log(`Minute ${minute} @ ${here}`)
    moveTo(steps[1])
  } else {
    moveTo(steps[0])
  }
}

function moveTo(valve) {
  console.log(`  Moving to ${valve}`)
  here = valve
}


console.log('**** TOTAL FLOWAGE: ', totalFlowage, '(want 1651)')



function bestChoiceFor(
  minute: number,
  whereWeAre: string,
  openValves: Array<string>,
  lookAheadSteps: number): [number, Array<string>] {

  if (lookAheadSteps <= 0) return [0, []]

  const cacheKey = `${minute} ${whereWeAre} ${openValves.join(',')}`
  if (!cache.has(cacheKey)) {

    const valve = valveMap[whereWeAre]

    let bestScore = -1
    let bestSteps = [] as Array<string>

    // What we might get if we don't open the valve
    valve.paths.forEach(path => {
      const [score, steps] =
        bestChoiceFor(
          minute + 1,
          path,
          [...openValves],
          lookAheadSteps - 1)
      if (score > bestScore) {
        bestSteps = [path, ...steps]
        bestScore = score
      }
    })

    if (!openValves.includes(valve.name)) {

      // take a minute to open the valve
      const valveScore = valve.flow * (LAST_MINUTE - minute)

      valve.paths.forEach(path => {
        const [score, steps] =
          bestChoiceFor(
            minute + 2,
            path,
            [...openValves, whereWeAre],
            lookAheadSteps - 2)
        if ((score + valveScore) > bestScore) {
          bestScore = score + valveScore
          bestSteps = ['OPEN', path, ...steps]
        }
      })
    }
    cache.set(cacheKey, [bestScore, bestSteps])
  // } else {
  //   console.log('cache hit!')
  }

  return cache.get(cacheKey)
}
