import assert = require("node:assert")
import * as fs from 'fs'

/*
Build a map of directories to their total sizes, including subdirectories.
 */
function dirSizes (lines: string[]) {

  // intermediate structures to hold file totals and names of subdirectories
  const fileSums: Record<string, number> = { '/': 0 }
  const subDirs: Record<string, Array<string>> = {}
  let path: Array<string> = []

  lines.forEach(line => {
    if (line == '$ cd ..') {
      path.pop()
    } else if (line.startsWith('$ cd ')) {
      path.push(line.match(/^. cd (.*)$/)![1])
      fileSums[cwd(...path)] = fileSums[cwd(...path)] || 0
      subDirs[cwd(...path)] = subDirs[cwd(...path)] || []
    } else if (line == '$ ls') {
      // do nothing
    } else if (line.startsWith('dir ')) {
      subDirs[cwd(...path)].push(cwd(...path, line.slice(4)))
    } else {
      const m = line.match(/^(\d+)/)
      if (m)
        fileSums[cwd(...path)] += Number(m[1])
      else
        console.error(`Non-matching line: ${line}`)
    }
  })

  return calcSums('/')

  /*
  Recursively calculate a folder's total size from the
  size of its direct sub-directories + its files.
   */
  function calcSums (dir: string): Record<string, number> {
    const subsSums = subDirs[dir]
      .reduce((acc, subDir) =>
                ({ ...acc, ...calcSums(subDir) }), {} as Record<string, number>)

    const dirSum = subDirs[dir]
      .map(d => subsSums[d])
      .reduce<number>((a, t) => (a + t), fileSums[dir])

    return {
      ...subsSums,
      [dir]: dirSum
    }
  }
}

const sumOfUnderLimit = (sums: number[], limit: number): number => sums.filter(s => s < limit).reduce((a, b) => a + b)

const smallestDirOverLimit = (sums: number[], limit: number): number => Math.min(...sums.filter(s => s >= limit))

function cwd (...path: string[]): string {
  return path.join('/')
}

let lines = fs
  .readFileSync('./sample-listing.txt')
  .toString()
  .split('\n')

let sizes = dirSizes(lines)
assert.equal(sumOfUnderLimit(Object.values(sizes), 100000), 95437)
assert.equal(smallestDirOverLimit(Object.values(sizes), 8381165), 24933642)

lines = fs
  .readFileSync('./listing.txt')
  .toString()
  .split('\n')

sizes = dirSizes(lines)
console.log(sumOfUnderLimit(Object.values(sizes), 100000))

console.log(sizes['/'])
const SPACE_AVAILABLE = 70000000
const UNUSED_SPACE_REQUIRED = 30000000
const USED_NOW = sizes['/']
const CURRENTLY_UNUSED = SPACE_AVAILABLE - USED_NOW
const BYTES_OVER = UNUSED_SPACE_REQUIRED - CURRENTLY_UNUSED
assert.equal(smallestDirOverLimit(Object.values(sizes), BYTES_OVER), 3579501)
