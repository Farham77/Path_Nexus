// Dijkstra's algorithm for grid graph (weights assumed uniform  effectively BFS with priority semantics)
// Discrete mathematics note: Dijkstra computes shortest path on weighted graphs using a priority queue and maintaining a set of settled vertices.

export function runDijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = []
  const pq = [] // simple array used as pq since weights are uniform

  const start = grid[startNode.row][startNode.col]
  start.distance = 0
  pq.push(start)

  while (pq.length > 0) {
    // pop node with smallest distance
    pq.sort((a,b) => a.distance - b.distance)
    const node = pq.shift()
    if (node.isWall) continue

    if (node.isVisited) continue
    node.isVisited = true
    visitedNodesInOrder.push(node)

    if (node.row === endNode.row && node.col === endNode.col) break

    getNeighbors(grid, node).forEach(neighbor => {
      if (neighbor.isWall) return
      const alt = node.distance + (neighbor.weight || 1) // account for node weight
      if (alt < neighbor.distance) {
        neighbor.distance = alt
        neighbor.previousNode = node
        pq.push(neighbor)
      }
    })
  }

  const nodesInShortestPathOrder = reconstructPath(grid, endNode)
  return { visitedNodesInOrder, nodesInShortestPathOrder }
}

function getNeighbors(grid, node) {
  const neighbors = []
  const { row, col } = node
  if (row > 0) neighbors.push(grid[row-1][col])
  if (row < grid.length - 1) neighbors.push(grid[row+1][col])
  if (col > 0) neighbors.push(grid[row][col-1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col+1])
  return neighbors
}

function reconstructPath(grid, endNode) {
  const path = []
  let current = grid[endNode.row][endNode.col]
  while (current && current.previousNode) {
    path.unshift(current)
    current = current.previousNode
  }
  return path
}
