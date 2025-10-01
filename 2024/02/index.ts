import { isSatisfiesExpression } from "../node_modules/typescript/lib/typescript";

const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const reports = [] as Array<Array<number>>
let safeCount = 0
let safeWithDampenerCount = 0

rl.on('line', (report) => {

    const levels = report.split(/\s+/).map(n => Number(n))

    if (isSafe(levels))
        safeCount += 1

    if (isSafeWithDampener(levels))
        safeWithDampenerCount += 1

    //console.log(report, isSafe(report))
});

rl.once('close', () => {

    console.log({ safeCount, safeWithDampenerCount })

})

function isSafe(levels: Array<number>) {

    let minDiff = 1
    let maxDiff = 3

    // Decreasing?
    if (levels[0] > levels[levels.length - 1]) {
        minDiff = -3
        maxDiff = -1
    }

    return isOrdered(levels)

    function isOrdered(levels: Array<number>) {
        if (levels.length < 2) return true

        const [level, ...rest] = levels
        const diff = rest[0] - level
        return diff >= minDiff &&
            diff <= maxDiff &&
            isOrdered(rest)
    }

}

function isSafeWithDampener(levels: Array<number>) {
    if (isSafe(levels)) return true

    for (let i = 0; i < levels.length; i++) {
      if (isSafe(levels.toSpliced(i, 1))) return true
    }

    return false
}