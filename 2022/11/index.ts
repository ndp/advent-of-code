import {readFileSync} from 'fs'

type WorryLevel = number
type MonkeyIndex = number

// how your worry level changes as that monkey inspects an item
type Operation = (current: WorryLevel) => WorryLevel

type Next = (current: WorryLevel) => MonkeyIndex

class Monkey {

  name: string

  // your worry level for each item the monkey is currently holding in the order they will be inspected
  itemQ: Array<WorryLevel>

  divisor: number
  operation: Operation

  test: Next

  inspectionCount: number = 0

  inspect() {
    let item
    while (this.itemQ.length > 0) {
      item = this.itemQ.shift()
      this.inspectItem(item)
    }
  }

  private inspectItem(item: WorryLevel) {
    this.inspectionCount++

    let level = this.operation(item)

    // Part I:
    // Monkey gets bored with item. Worry level is divided by 3
    //level = Math.floor(level / 3)

    // Part II:
    level %= masterDivisor

    const nextMonkey = this.test(level)

    monkeys[nextMonkey].itemQ.push(level)
  }

  toString() {
    return `${this.name} ${this.itemQ.join(', ')}  Inspected: ${this.inspectionCount}`
  }
}

const monkeys: Monkey[] = makeMonkeys('./notes.txt')

// Each monkey divides the worry level by a certain amount, so math
// with work "modulo" that amount for that monkey. To make modulo math
// work for ALL monkeys, we simply need a least common multiple... or
// in this case, not even the last common... just all those divisors multiple
// together.
const masterDivisor = monkeys.reduce((a, m) => a * m.divisor, 1)

for (let round = 1; round <= 10000; round++) {

  monkeys.forEach(monkey => monkey.inspect())
  if (round % 1000 === 0) {
    console.log('After Round ', round)
    monkeys.forEach(monkey => console.log(monkey.toString()))

  }
}

const inspections = monkeys.map(m => m.inspectionCount).sort((a, b) => b - a)
console.log(inspections)
console.log(inspections[0] * inspections[1])

function makeMonkeys(fileName: string) {

  return readFileSync(fileName)
    .toString()
    .split('\n\n')
    .map(block => {
      const monkey = new Monkey()
      const lines = block.split('\n')
      monkey.name = lines[0]
      monkey.itemQ = lines[1].split(': ')[1].split(', ').map(i => Number(i))
      const {op, operand} = lines[2].match(/new = old (?<op>[+*])\s*(?<operand>old|\d+)/).groups
      monkey.operation = (level) => {
        const n = operand === 'old' ? level : Number(operand)
        return op === '+' ? level + n : level * n
      }

      // Test: divisible by 19
      monkey.divisor = Number(lines[3].match(/(\d+)/)[1])
      // If true: throw to monkey 2
      const ifTrue = Number(lines[4].match(/(\d+)/)[1])
      // If false: throw to monkey 2
      const ifFalse = Number(lines[5].match(/(\d+)/)[1])


      monkey.test = lev => (lev % monkey.divisor === 0 ? ifTrue : ifFalse)

      return monkey
    })

}
