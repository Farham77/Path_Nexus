// A* algorithm for grid graph using Manhattan distance heuristic
// Discrete mathematics note: A* uses heuristic estimates (admissible heuristics like Manhattan distance) to optimize search over the set of vertices, often reducing explored nodes.

function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
}

export function runAStar(grid, startNode, endNode) {
  const visitedNodesInOrder = []
  const open = []

  const start = grid[startNode.row][startNode.col]
  start.g = 0
  start.h = manhattan(start, grid[endNode.row][endNode.col])
  start.f = start.g + start.h
  open.push(start)

  while (open.length > 0) {
    // pop node with lowest f
    open.sort((a,b) => a.f - b.f)
    const node = open.shift()
    if (node.isWall) continue

    if (node.isVisited) continue
    node.isVisited = true
    visitedNodesInOrder.push(node)

    if (node.row === endNode.row && node.col === endNode.col) break

    getNeighbors(grid, node).forEach(neighbor => {
      if (neighbor.isWall) return
      const tentative_g = node.g + (neighbor.weight || 1)
      if (tentative_g < neighbor.g) {
        neighbor.previousNode = node
        neighbor.g = tentative_g
        neighbor.h = manhattan(neighbor, grid[endNode.row][endNode.col])
        neighbor.f = neighbor.g + neighbor.h
        open.push(neighbor)
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
