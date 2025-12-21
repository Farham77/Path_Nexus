// Depth-First Search (DFS) implementation for grid graph
// Discrete mathematics note: DFS explores vertices by going as deep as possible along a branch before backtracking. DFS is not guaranteed to find shortest path in unweighted graphs.

export function runDFS(grid, startNode, endNode) {
  const visitedNodesInOrder = []
  const stack = []
  stack.push(grid[startNode.row][startNode.col])
  grid[startNode.row][startNode.col].isVisited = true

  while (stack.length > 0) {
    const node = stack.pop()
    visitedNodesInOrder.push(node)
    if (node.row === endNode.row && node.col === endNode.col) break

    getNeighbors(grid, node).forEach(neighbor => {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true
        neighbor.previousNode = node
        stack.push(neighbor)
      }
    })
  }

  const nodesInShortestPathOrder = reconstructPath(grid, endNode)
  return { visitedNodesInOrder, nodesInShortestPathOrder }
}

function getNeighbors(grid, node) {
  // Note: For deterministic DFS we can change neighbor ordering
  const neighbors = []
  const { row, col } = node
  if (row > 0) neighbors.push(grid[row-1][col])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col+1])
  if (row < grid.length - 1) neighbors.push(grid[row+1][col])
  if (col > 0) neighbors.push(grid[row][col-1])
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
