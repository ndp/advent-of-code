import * as fs from 'fs'

const Lower = 'abcdefghijklmnopqrstuvwxyz'
const Upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

type Letter = string
type StringTuple = [string,string,string]

const lines = fs.readFileSync('./sacks.txt').toString().split('\n')

const part1 = lines
  .map(line => valueOf(findCommonLetters(...splitString(line))[0]))
  .reduce((a,v) => a+v)
console.log({part1})

const groups = lines
  .reduce((a, line) => {
    if (a[0].length < 3)
      a[0].push(line)

    else
      a.unshift([line])
    return a
  }, [[] as Array<String>]) as unknown as Array<StringTuple>


const part2 = groups
  .map(g => findCommonLetters3(...g))
  .map(common => valueOf(common[0]))
  .reduce((a,x) => a+x, 0)

console.log({part2})

function splitString(s: string): [string, string] {
  const len = s.length
  if (len % 2 !== 0) throw `not even length: ${s}`
  return [s.slice(0, len / 2), s.slice(len/2, len)]
}


function findCommonLetters(strA: string, strB: string) {
  return strA
    .split('')
    .reduce((acc,ch) => acc + (strB.indexOf(ch) < 0 ? '' : acc+ ch), '')
}

function findCommonLetters3(strA: string, strB: string, strC: string) {
  return strA
    .split('')
    .reduce((acc,ch) => acc + ((strB.indexOf(ch) >= 0  && strC.indexOf(ch) >= 0)?  acc+ ch : ''), '')
}


function valueOf(x: Letter) {
  const u = Upper.indexOf(x)
  if (u >= 0) return u + 27

  return Lower.indexOf(x) + 1
}
