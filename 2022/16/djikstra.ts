
// https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/

type CoordStr = string

export function dijkstra(start: CoordStr, end: (n: CoordStr) => boolean, edges: Links): number {
  const unvisited = new Set(Object.keys(edges))
  const distance = {} as Record<CoordStr, number>

  distance[start] = 0
  while (unvisited.size) {

    const nearestUnvisitedNode =
      [...unvisited]
        .reduce((best, n) => {
          if (!distance.hasOwnProperty(n)) return best // no distance yet?
          if (!distance.hasOwnProperty(best)) return n // no best distance?
          return distance[n] < distance[best] ? n : best;
        }, unvisited[0])

    visit(nearestUnvisitedNode)

    if (end(nearestUnvisitedNode))
      return distance[nearestUnvisitedNode];
  }

  return Infinity

  function visit(node: CoordStr) {
    unvisited.delete(node)

    // we are visiting because we know we have the shortest path!
    const toHere = distance[node]

    // looking through all our links, replace any that are longer than through this node
    edges[node].forEach(n => {
      if (!distance.hasOwnProperty(n) ||
        (toHere + 1) < distance[n])
        distance[n] = toHere + 1
    })

  }


}
