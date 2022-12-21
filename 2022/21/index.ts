import {readFileSync} from 'fs'

const SCRIPT = `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`

const COMMANDS =
  SCRIPT
    .split('\n')
    .filter(line => line.length > 4)
    .map(line => line.split(': '))
    .reduce((acc, [m, a]) => {
      acc[m] = a
      return acc
    }, {})


while (true) {
  if (typeof root)
}
