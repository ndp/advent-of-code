export type Node = {
  value: number
  next: Node | null
  prev: Node | null
}

// export function asNodeList2([v, ...rest]: number[], prev: Node | null = null) {
//   const newNode = {
//     value: v,
//     next: null, // we need to calculate
//     prev: prev
//   };
//   const next = rest.length === 0 ? null : asNodeList2(rest, newNode)
//   newNode.next = next
//   return newNode
// }

function asNode(value: number) {
  return {value, next: null, prev: null}
}

export function asNodeList(values: number[]) {
  let prev = null
  let head = null
  for (let v of values) {
    const newNode = asNode(v)
    head = insertAfter(head, prev, newNode)
    prev = newNode
  }
  return head
}

export function forEach(head: Node, f: (node: Node) => void) {
  let node = head
  do {
    f(node)
    node = node.next
  } while(node !== head)
}

export function values(h: Node) {
  let a = []
  forEach(h, (node) => a.push(node.value))
  return a
}

export function asString(h: Node) {
  return values(h).join(', ')
}

// Returns (possibly new) head
export function removeNode(head: Node, nodeToRemove: Node): Node {
  const next = nodeToRemove.next;
  const prev = nodeToRemove.prev
  prev.next = next
  next.prev = prev
  // nodeToRemove.prev = nodeToRemove.next = null
  return (nodeToRemove === head) ? next : head
}

// Returns (possibly new) head
// "prev" == null means put it at the beginning
export function insertAfter(head: Node, prev: Node, nodeToInsert: Node): Node {

  if (!head && !prev) {
    nodeToInsert.next = nodeToInsert
    nodeToInsert.prev = nodeToInsert
    return nodeToInsert
  }

  // prev == null means "beginning", so...
  if (!prev) {
    prev = head.prev
    head = nodeToInsert
  }

  const next = prev.next
  nodeToInsert.prev = prev
  nodeToInsert.next = next
  prev.next = nodeToInsert
  next.prev = nodeToInsert
  return head
}

export function insertAt(head: Node, at: Node, nodeToInsert: Node): Node {

  if (!head && !at) {
    nodeToInsert.next = nodeToInsert.prev = nodeToInsert
    return nodeToInsert
  }
  if (!head) throw 'No head'
  if (!at) throw 'No at'
  if (!at.prev) throw 'No at.prev'

  const prev = at.prev
  prev.next = nodeToInsert
  nodeToInsert.prev = prev
  nodeToInsert.next = at
  at.prev = nodeToInsert
  return at === head ? nodeToInsert : head
}
