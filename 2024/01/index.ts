import { access } from "fs";

const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const as = [] as Array<number>
const bs = [] as Array<number>

rl.on('line', (line) => {
    const [a, b] = line.split(/\s+/)
    if (b === undefined) return
    as.push(Number(a))
    bs.push(Number(b))
});

rl.once('close', () => {
    as.sort()
    bs.sort()

    const diffs = as.reduce((acc, a, i) => {
        return acc + Math.abs(a - bs[i])
    }, 0)
    console.log({ diffs })

    const bCounts = bs.reduce((acc, b) => { acc[b] = (acc[b] || 0) + 1; return acc }, {})
    const similarity = as.reduce((acc, a) => acc + a * (bCounts[a] || 0), 0)

    console.log({ similarity })

});
