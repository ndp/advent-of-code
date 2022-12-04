import * as fs from 'fs'

const Lower = 'abcdefghijklmnopqrstuvwxyz'
const Upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
type Letter = string
type StringTuple = [string, string, string]

const lines = fs
  .readFileSync('./sacks.txt')
  .toString()
  .split('\n')
  .filter(s => !!s)

const part1 = lines
  .map(line => valueOf(commonLetters(...splitString(line))[0]))
  .reduce((a, v) => a + v)
console.log({ part1, expected: 7746 })

const groups = lines
  .reduce((a, line) => {
    if (a[0].length < 3)
      a[0].push(line)
    else
      a.unshift([line])
    return a
  }, [[] as Array<String>]) as unknown as Array<StringTuple>

const part2 = groups
  .map(g => commonLetters(...g))
  .map(common => valueOf(common[0]))
  .reduce((a, x) => a + x, 0)

console.log({ part2, expected: 2604 })

function splitString (s: string): [string, string] {
  if (s.length % 2 !== 0) throw `not even length: ${s}`
  const half = s.length / 2
  return [s.slice(0, half), s.slice(half)]
}


function commonLetters (strA: string, strB: string, strC?: string): string {
  const common = strA
    .split('')
    .reduce((acc, ch) => acc + (strB.indexOf(ch) < 0 ? '' : ch), '')
  return strC
    ? commonLetters(common, strC)
    : common
}


function valueOf (x: Letter) {
  const u = Upper.indexOf(x)
  if (u >= 0) return u + 27
  return Lower.indexOf(x) + 1
}
