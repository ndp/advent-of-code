import * as fs from 'fs'

type Assignment = [number, number]
type AssignmentPair = [Assignment, Assignment]

const assignments = fs
  .readFileSync('./assignments.txt')
  .toString()
  .split('\n')
  .filter(s => !!s)
  .map(line => line
    .split(',')
    .map(assignment =>
           assignment.split('-')
            .map(ch => Number(ch)))
  ) as Array<AssignmentPair>


console.log({ part1: assignments
  .filter(a => fullyContained(a))
  .length})

console.log({ part2: assignments
  .filter(a => overlap(a))
  .length})

function overlap(assignments: AssignmentPair) {
  const [pair1, pair2] = assignments

  // if pair1 ends before pair2 starts, they don't overlap
  if (pair1[1] < pair2[0]) return false

  // if pair2 ends before pair1 starts, they don't overlap
  if (pair2[1] < pair1[0]) return false

  // otherwise, they must overlap
  return true

}

function fullyContained (assignments: AssignmentPair) {
  const [pair1, pair2] = assignments

  // is pair 1 inside pair 2?
  if (pair1[0]>= pair2[0] && pair1[1] <= pair2[1])
    return true

  // is pair 2 inside pair 1?
  if (pair2[0]>= pair1[0] && pair2[1] <= pair1[1])
    return true

  return false
}
