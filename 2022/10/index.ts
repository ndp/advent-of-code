import {readFileSync} from 'fs'

const input = readFileSync('./data.txt')
  .toString()
  .split('\n')
  .filter((line: string) => !!line) as string[]


// convert inputs to deltas
const deltas = input
  .flatMap(line => {
    if (line === 'noop')
      return 0
    else {
      const n = line.split(' ')[1]
      return [0, Number(n)]
    }
  }) as Array<number>


// convert deltas to Xs
let X = 1
const Xs = deltas.map(v => {
  X += v
  return X
})

// Look at the state right before the 20th, 60th, 100th, etc.
// and make a summation of the X * the index
let sum = 0
for (let i = 0; i < Xs.length; i++)
  if (i % 40 === 18) { // index 19 is the "20th", and we actually want "before 20"
    sum += Xs[i] * (i + 2) // +2 compensates for the 18 above
  }

console.log({sum, expected: 13140})


/// Part II: Draw screen!
let crt = '#'
for (let i = 1; i < 240; i++) {
  let xIndex = i % 40
  const spriteX = Xs[i - 1]
  crt += Math.abs(xIndex - spriteX) < 2 ? '#' : '.'
  if (i % 40 == 39) crt += '\n'
}

console.log(crt)

/*
Drew:
###..###....##.#....####.#..#.#....###..
#..#.#..#....#.#....#....#..#.#....#..#.
###..#..#....#.#....###..#..#.#....#..#.
#..#.###.....#.#....#....#..#.#....###..
#..#.#.#..#..#.#....#....#..#.#....#....
###..#..#..##..####.#.....##..####.#....

 */
