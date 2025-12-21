import { test, expect } from 'vitest'
import { runBFS } from './bfs'

function makeGrid(rows, cols, start, end, walls = []) {
  const grid = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      row.push({ row: r, col: c, isStart: r === start.row && c === start.col, isEnd: r === end.row && c === end.col, isWall: false, isVisited: false, previousNode: null })
    }
    grid.push(row)
  }
  walls.forEach(w => grid[w.row][w.col].isWall = true)
  return grid
}

test('BFS finds shortest path in empty grid', () => {
  const start = { row: 0, col: 0 }
  const end = { row: 2, col: 2 }
  const grid = makeGrid(3, 3, start, end)
  const res = runBFS(grid, start, end)
  expect(res.nodesInShortestPathOrder.length).toBeGreaterThan(0)
  const tail = res.nodesInShortestPathOrder[res.nodesInShortestPathOrder.length - 1]
  expect(tail.row).toBe(end.row)
  expect(tail.col).toBe(end.col)
})
