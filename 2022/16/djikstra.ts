// https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/

type NodeId = string
export type Links = Record<NodeId, Record<NodeId, number>>

export function shortestPath(
  start: NodeId,
  end: NodeId | ((n: NodeId) => boolean),
  nodes: Links): number {

  // If `end` is passed in a  value, convert it to a function
  if (typeof end !== 'function')
    end = ((endValue) => (n: NodeId) => n === endValue)(end)

  const unvisited = new Set(Object.keys(nodes))
  const distance = {} as Record<NodeId, number>

  distance[start] = 0

  while (unvisited.size) {

    const nearestUnvisitedNode = getNearestUnvisitedNode();

    visit(nearestUnvisitedNode)

    if (end(nearestUnvisitedNode))
      return distance[nearestUnvisitedNode];
  }

  return Infinity

  function visit(visiting: NodeId) {
    unvisited.delete(visiting)

    // we are visiting because we know we have the shortest path!
    const toHere = distance[visiting]

    // looking through all our links, replace any that are longer than through this node
    const outboundDistances = nodes[visiting];
    const outboundNodes = Object.keys(outboundDistances);

    outboundNodes.forEach(n => {

      const distanceViaOutbound = toHere + outboundDistances[n];

      if (!distance.hasOwnProperty(n)
        || distanceViaOutbound < distance[n])
        distance[n] = distanceViaOutbound
    })
  }

  function getNearestUnvisitedNode() {
    return [...unvisited]
      .reduce((best, n) => {
        if (!distance.hasOwnProperty(n)) return best // no distance yet?
        if (!distance.hasOwnProperty(best)) return n // no best distance?
        return distance[n] < distance[best] ? n : best;
      })
  }


}
