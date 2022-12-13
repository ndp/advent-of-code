import {readFileSync} from 'fs'

const REAL_DATA = true
const filename =
  REAL_DATA ?
    './packets.txt' : './packets-sample.txt'

const packetPairs =
  readFileSync(filename)
    .toString()
    .split('\n\n')
    .map(g =>
      g
        .split('\n')
        .filter(line => !!line)
        .map(line => eval(line)))

// Part I
const analysis =
  packetPairs
    .map(([left, right]) => {
      console.log('\n')
      return arePacketsInOrder(left, right)
    })
    .map((inOrder, index) => inOrder ? (index + 1) : 0)
    .reduce((a, v) => a + v)

console.log(analysis)

// Part II
const inOrder =
  [...packetPairs, [[[2]], [[6]]]]
    .flatMap(([left, right]) => {
      return [left, right]
    })
    .sort((left, right) =>
      arePacketsInOrder(left, right) ? -1 : 1
    )
    .map(a => JSON.stringify(a))


const d1 = inOrder.indexOf('[[2]]')
const d2 = inOrder.indexOf('[[6]]')

console.log({d1, d2, decoderKey: (d1 + 1) * (d2 + 1)})

// Details, details...
function arePacketsInOrder(left: Array<any>, right: Array<any>): boolean {
  // packets are always arrays
  return compareArrays(left, right)
}

function compareAny(left: Array<any> | number, right: Array<any> | number): boolean {
  if (Array.isArray(left) && typeof right === 'number') return compareArrays(left, [right])
  if (typeof left === 'number' && Array.isArray(right)) return compareArrays([left], right)

  if (typeof left === 'number' && typeof right === 'number')
    return compareNumbers(left, right)

  assertArray(left)
  assertArray(right)
  return compareArrays(left, right)
}

function compareNumbers(left: number, right: number): boolean | undefined {
  console.log(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`)
  if (left < right) console.log('  Left side is smaller, so inputs are in the right order')
  else if (left > right) console.log('  Right side is smaller, so inputs are not in the right order')

  if (left < right) return true
  else if (left > right) return false
  else return undefined
}

function compareArrays(left: Array<any>, right: Array<any>): boolean {

  console.log(`Compare list ${JSON.stringify(left)} vs ${JSON.stringify(right)}`)

  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const fLeft = left[i]
    const fRight = right[i]

    // console.log(`  compare ${i}th: ${fLeft} vs ${fRight}`)

    const firsts = compareAny(fLeft, fRight);
    if (firsts !== undefined) return firsts
  }

  if (left.length < right.length)
    console.log('Left side ran out of items, so inputs are in the right order')
  else if (left.length > right.length)
    console.log('Right side ran out of items, so inputs are not in the right order')
  if (left.length < right.length)
    return true
  else if (left.length > right.length)
    return false
  return undefined
}

function assertArray(a: unknown): asserts a is Array<any> {
  if (!Array.isArray(a)) throw new Error("Not an array")
}
