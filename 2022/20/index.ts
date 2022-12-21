import {readFileSync} from 'fs'
import {asNodeList, asString, forEach, insertAt, removeNode} from "./LinkedList";

let head


const INPUT = `1
2
-3
3
-2
0
4`
const REAL_INPUT = readFileSync('./puzzle-input.txt')
  .toString()

const NUMBERS =
  REAL_INPUT
    .split('\n')
    .filter(line => line !== '')
    .map(line => parseInt(line))

// Convert into a linked list
head = asNodeList(NUMBERS);


// Make of queue of nodes we are going to move
const queue = []
forEach(head, n => queue.push(n))


// move nodes from the queue
while (queue.length > 0) {
  moveNode(queue.shift())
}

// output the results
console.log({grooveCoordinates: grooveCoordinates(head), not: [-3329, -1464, -7083, -17533, 16775, 6571]})

function moveNode(nodeToMove) {
  // console.log('moveNode', nodeToMove.value, nodeToMove.value % NUMBERS.length, queue.length)

  let positionsToMove = nodeToMove.value
  let dir = 'next' as 'next' | 'prev'
  if (positionsToMove < 0) {
    dir = 'prev'
    positionsToMove = -positionsToMove -1
  }

  //i %= NUMBERS.length - 1
  // if (i === 0) return

  let where = nodeToMove[dir]
  head = removeNode(head, nodeToMove)

  while (positionsToMove-- >= 1) where = where[dir]

  if (where === nodeToMove) return
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
    console.log(`groove #${g + 1}:`, node.value)
    grooves.push(node.value)
  }
  return grooves.reduce((a, g) => a + g)
}




/********************/

test(1, [4, 5, 6, 1, 7, 8, 9], [4, 5, 6, 7, 1, 8, 9])
test(-2, [4, -2, 5, 6, 7, 8, 9], [4, 5, 6, 7, 8, -2, 9])
test(5, [1,2,3,4,5,6,7],[1,2,3,5,4,6,7])
test(-2, [1,2,3,-2,4,5,6,7],[1,-2,2,3,4,5,6,7])
test(-5, [1,2,3,-5,4,5,6,7],[1,2,3,4,5,-5, 6,7])
test(10, [1,2,3,10,4,5,6,7],[1,2,3,4,5, 6,10,7])

function test(moveMe: number, start: Array<number>, expected: Array<number>) {
  head = asNodeList(start);
  let node = head
  while(node.value !== moveMe) node = node.next

  moveNode(node)

  const result = asString(head)
  const match = result === expected.join(', ');
  console[match ? 'log' : 'error'](match ? 'OK' : 'NO', result, ', move',node.value,' expected: ', expected.join(', '))
}
