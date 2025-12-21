// Breadth-First Search (BFS) implementation for grid graph
// Discrete mathematics note: BFS explores vertices layer-by-layer using a FIFO queue. It operates on the set of discovered (visited) nodes and ensures shortest path in unweighted graphs.

export function runBFS(grid, startNode, endNode) {
  const visitedNodesInOrder = []
  const queue = []
  queue.push(grid[startNode.row][startNode.col])
  grid[startNode.row][startNode.col].isVisited = true

  while (queue.length > 0) {
    const node = queue.shift()
    visitedNodesInOrder.push(node)
    if (node.row === endNode.row && node.col === endNode.col) break

    getNeighbors(grid, node).forEach(neighbor => {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true
        neighbor.previousNode = node
        queue.push(neighbor)
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
