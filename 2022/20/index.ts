import {readFileSync} from 'fs'
import {asNodeList, asString, forEach, insertAt, removeNode} from "./LinkedList";

// We're using a (doubly-)linked list
let head

const PART_DEUX = true

let DECRYPTION_KEY = 1
let MIX_COUNT = 1
let INPUT = `1 2 -3 3 -2 0 4`

if (PART_DEUX) {
  MIX_COUNT = 10
  DECRYPTION_KEY = 811589153
}

const REAL_INPUT = readFileSync('./puzzle-input.txt')
  .toString()

const NUMBERS =
  REAL_INPUT
    .split(/\s+/)
    .filter(line => line !== '')
    .map(line => parseInt(line))

// Convert into a linked list
head = asNodeList(NUMBERS.map(n => n * DECRYPTION_KEY))


// Make of queue of nodes we are going to move
const originalOrderQueue = []
forEach(head, n => originalOrderQueue.push(n))


// move nodes from the queue
for (let i = 0; i < MIX_COUNT; i++) {
  const queue = [...originalOrderQueue]
  while (queue.length > 0) {
    moveNode(queue.shift())
  }
}

// output the results
console.log({
  grooveCoordinates: grooveCoordinates(head),
  part1: 3466,
  part2: 9995532008348
})

function moveNode(nodeToMove) {

  let positionsToMove = nodeToMove.value
  let dir = 'next' as 'next' | 'prev'
  if (positionsToMove < 0) {
    dir = 'prev'
    positionsToMove = -positionsToMove - 1
  }

  positionsToMove %= NUMBERS.length - 1 // -1 to account for the node we're moving not being there
  if (positionsToMove === 0) return

  // we move off the node we're moving so we can remove it (next line)
  let where = nodeToMove[dir]
  head = removeNode(head, nodeToMove)

  while (positionsToMove-- >= 1) where = where[dir]

  head = insertAt(head, where, nodeToMove)
}


/*
Then, the grove coordinates can be found by looking at the 1000th, 2000th, and 3000th numbers after the value 0, wrapping around the list as necessary. In the above example, the 1000th number after 0 is 4, the 2000th is -3, and the 3000th is 2; adding these together produces 3.
 */
function grooveCoordinates(head) {
  let node = head
  while (node.value !== 0) node = node.next

  const grooves = []
  for (let g = 0; g < 3; g++) {
    for (let i = 0; i < 1000; i++)
      node = node.next
    // console.log(`groove #${g + 1}:`, node.value)
    grooves.push(node.value)
  }
  return grooves.reduce((a, g) => a + g)
}


/********UNIT TESTS************/

test(1, [4, 5, 6, 1, 7, 8, 9], [4, 5, 6, 7, 1, 8, 9])
test(-2, [4, -2, 5, 6, 7, 8, 9], [4, 5, 6, 7, 8, -2, 9])
test(5, [1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 5, 4, 6, 7])
test(-2, [1, 2, 3, -2, 4, 5, 6, 7], [1, -2, 2, 3, 4, 5, 6, 7])
test(-5, [1, 2, 3, -5, 4, 5, 6, 7], [1, 2, 3, 4, 5, -5, 6, 7])
test(10, [1, 2, 3, 10, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 10, 7])

function test(moveMe: number, start: Array<number>, expected: Array<number>) {
  head = asNodeList(start);
  let node = head
  while (node.value !== moveMe) node = node.next

  moveNode(node)

  const result = asString(head)
  const match = result === expected.join(', ');
  console[match ? 'log' : 'error'](match ? 'OK' : 'NO', result, ', move', node.value, ' expected: ', expected.join(', '))
}
