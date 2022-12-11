import {readFileSync} from 'fs'

type WorryLevel = number
type MonkeyIndex = number

// shows how your worry level changes as that monkey inspects an item
type Operation = (current: WorryLevel) => WorryLevel

type Next = (current: WorryLevel) => MonkeyIndex

class Monkey {

  name: string

  // your worry level for each item the monkey is currently holding in the order they will be inspected
  itemQ: Array<WorryLevel>

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

    // Monkey gets bored with item. Worry level is divided by 3
    level = Math.floor(level / 3)

    const nextMonkey = this.test(level)

    monkeys[nextMonkey].itemQ.push(level)
  }

  toString() {
    return `${this.name} ${this.itemQ.join(', ')}  Inspected: ${this.inspectionCount}`
  }
}

const monkeys: Monkey[] = readNotes('./notes-sample.txt')
//console.log({monkeys})

for (let round = 1; round <= 20; round++) {

  monkeys.forEach(monkey => monkey.inspect())

  console.log('After Round ', round)
  monkeys.forEach(monkey => console.log(monkey.toString()))
}

const inspections  = monkeys.map(m => m.inspectionCount).sort((a,b) => b-a)
console.log(inspections)
console.log(inspections[0] * inspections[1])

function readNotes(fileName: string) {

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
      const divisor = Number(lines[3].match(/(\d+)/)[1])
      // If true: throw to monkey 2
      const ifTrue = Number(lines[4].match(/(\d+)/)[1])
      // If false: throw to monkey 2
      const ifFalse = Number(lines[5].match(/(\d+)/)[1])

      monkey.test = lev => (lev % divisor === 0 ? ifTrue : ifFalse)

      return monkey
    })

}
