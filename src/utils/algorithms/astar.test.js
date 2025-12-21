import { test, expect } from 'vitest'
import { runAStar } from './astar'

function makeGrid(rows, cols, start, end) {
  const grid = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      row.push({ row: r, col: c, isStart: r === start.row && c === start.col, isEnd: r === end.row && c === end.col, isWall: false, isVisited: false, previousNode: null, g: Infinity, h: Infinity, f: Infinity, weight: 1 })
    }
    grid.push(row)
  }
  return grid
}

test('A* finds optimal path using Manhattan heuristic', () => {
  const start = { row: 0, col: 0 }
  const end = { row: 2, col: 2 }
  const grid = makeGrid(3, 3, start, end)
  const res = runAStar(grid, start, end)
  expect(res.nodesInShortestPathOrder.length).toBeGreaterThan(0)
  const last = res.nodesInShortestPathOrder[res.nodesInShortestPathOrder.length - 1]
  expect(last.row).toBe(end.row)
  expect(last.col).toBe(end.col)
})

test('A* respects node weights when choosing path', () => {
  const g = makeGrid(3,3,{row:0,col:0},{row:0,col:2})
  g[0][1].weight = 100
  const res = runAStar(g, {row:0,col:0}, {row:0,col:2})
  const includesHeavy = res.nodesInShortestPathOrder.some(n => n.row===0 && n.col===1)
  expect(includesHeavy).toBe(false)
})
