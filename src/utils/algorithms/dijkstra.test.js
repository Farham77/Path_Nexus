import { test, expect } from 'vitest'
import { runDijkstra } from './dijkstra'

function makeGrid(rows, cols, start, end) {
  const grid = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      row.push({ row: r, col: c, isStart: r === start.row && c === start.col, isEnd: r === end.row && c === end.col, isWall: false, isVisited: false, previousNode: null, distance: Infinity })
    }
    grid.push(row)
  }
  return grid
}

test('Dijkstra finds shortest path with uniform weights', () => {
  const start = { row: 0, col: 0 }
  const end = { row: 2, col: 2 }
  const grid = makeGrid(3, 3, start, end)
  const res = runDijkstra(grid, start, end)
  expect(res.nodesInShortestPathOrder.length).toBeGreaterThan(0)
  const last = res.nodesInShortestPathOrder[res.nodesInShortestPathOrder.length - 1]
  expect(last.row).toBe(2)
  expect(last.col).toBe(2)
})

// Weighted nodes: prefer low-total-weight route over shorter but heavy path
test('Dijkstra prefers low-weight paths over short heavy ones', () => {
  const start = { row: 0, col: 0 }
  const end = { row: 0, col: 2 }
  const grid = makeGrid(1, 3, start, end) // 1x3 row
  // make middle heavy
  grid[0][1].weight = 50
  const res = runDijkstra(grid, start, end)
  const path = res.nodesInShortestPathOrder
  // path should avoid heavy center by going around (but since grid is 1x3 there's no around path)
  // Instead, build a 3x3 with alternate route
  const g2 = makeGrid(3,3,{row:0,col:0},{row:0,col:2})
  g2[0][1].weight = 50
  // alternative route via bottom row -> path should not include heavy cell
  const res2 = runDijkstra(g2, {row:0,col:0}, {row:0,col:2})
  const includesHeavy = res2.nodesInShortestPathOrder.some(n => n.row===0 && n.col===1)
  expect(includesHeavy).toBe(false)
})
