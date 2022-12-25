import {readFileSync} from 'fs'
import {Blizzard} from "./Blizzard";
import {Grid} from "./Grid";

const b = new Blizzard(3, 3, 5, 5, '^')

const lines = readFileSync('./puzzle-input-sample.txt')
  .toString()
  .split('\n')
  .filter(line => line.length > 0)

let g = new Grid(lines[0].length - 2, lines.length - 2)

lines.shift() // get rid of the header
for (let lineNo = 0; lineNo < lines.length - 1; lineNo += 1) {
  let line = lines[lineNo]
  line = line.substring(1, line.length - 1)

  line.split('').forEach((ch, column) => {
    if (ch == '.') return
    g.addBlizzard({row: lineNo, column: column, blizzardChar: ch})
  })
}


console.log(g.draw(4))
console.log(g.draw(5))
console.log(g.draw(6))
console.log(g.draw(7))
console.log(g.draw(8))
/*
Minute 4, move up:
#.######
#E<..22#
#<<.<..#
#<2.>>.#
#.^22^.#
######.#

Minute 5, move right:
#.######
#2Ev.<>#
#<.<..<#
#.^>^22#
#.2..2.#
######.#

Minute 6, move right:
#.######
#>2E<.<#
#.2v^2<#
#>..>2>#
#<....>#
######.#

Minute 7, move down:
#.######
#.22^2.#
#<vE<2.#
#>>v<>.#
#>....<#
######.#

Minute 8, move left:
#.######
#.<>2^.#
#.E<<.<#
#.22..>#
#.2v^2.#
######.#

Minute 18, move down:
#.######
#>2.<.<#
#.2v^2<#
#>..>2>#
#<....>#
######E#

 */
