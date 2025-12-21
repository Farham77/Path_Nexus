import React, { useEffect, useState, useRef } from 'react'
import Node from './Node'
import { runBFS } from '../utils/algorithms/bfs'
import { runDFS } from '../utils/algorithms/dfs'
import { runDijkstra } from '../utils/algorithms/dijkstra'
import { runAStar } from '../utils/algorithms/astar'

// Grid component maps a 2D array of cells to a graph:
// - Each cell is a vertex (node)
// - Adjacent cells (up/down/left/right) represent edges
// The component manages local state for walls and visual flags used by the algorithms.

// Helper to create initial grid as a 2D array of node objects
function createEmptyGrid(rows, cols, startPos, endPos) {
  const grid = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isStart: r === startPos.row && c === startPos.col,
        isEnd: r === endPos.row && c === endPos.col,
        isWall: false,
        isVisited: false,
        isPath: false,
        previousNode: null,
        distance: Infinity,
        f: Infinity, g: Infinity, h: Infinity,
        weight: 1 // default uniform weight
      })
    }
    grid.push(row)
  }
  return grid
}

export default function Grid({ rows, cols, startPos, endPos, setStartPos, setEndPos, algorithm, visualizeTrigger, clearGridTrigger, speed, setIsRunning, stepMode, stepTrigger, onStepNext, selectedWeight, placingMode }) {
  const [grid, setGrid] = useState(() => createEmptyGrid(rows, cols, startPos, endPos))
  const [mouseDown, setMouseDown] = useState(false)
  const placing = useRef('wall') // 'start', 'end', 'wall'

  // Step-mode helpers (refs and indices) — indices are local state so we can track progress
  const visitedRef = useRef([])
  const pathRef = useRef([])
  const [visitedIndex, setVisitedIndex] = useState(0)
  const [pathIndex, setPathIndex] = useState(0)

  // Sync placing mode from parent (controlled by Controls)
  useEffect(() => { placing.current = placingMode }, [placingMode])

  useEffect(() => {
    setGrid(createEmptyGrid(rows, cols, startPos, endPos))
  }, [rows, cols, startPos, endPos, clearGridTrigger])

  // toggle wall or place start/end
  function handleMouseDown(node) {
    setMouseDown(true)
    if (node.isStart) placing.current = 'start'
    else if (node.isEnd) placing.current = 'end'
    else placing.current = placingMode || 'wall'
    updateNodeOnInteraction(node)
  }

  function handleMouseEnter(node) {
    if (!mouseDown) return
    updateNodeOnInteraction(node)
  }

  function handleMouseUp(node) {
    setMouseDown(false)
    placing.current = 'wall'
  }

  function updateNodeOnInteraction(node) {
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(n => ({...n})))

      const target = newGrid[node.row][node.col]
      if (placing.current === 'start') {
        // move start
        for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) newGrid[r][c].isStart = false
        target.isStart = true
        setStartPos({row: node.row, col: node.col})
      } else if (placing.current === 'end') {
        for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) newGrid[r][c].isEnd = false
        target.isEnd = true
        setEndPos({row: node.row, col: node.col})
      } else if (placing.current === 'weight') {
        // toggle weight on the cell
        target.isWall = false
        target.weight = (target.weight && target.weight > 1) ? 1 : (selectedWeight || 5)
      } else {
        target.isWall = !target.isWall
      }
      return newGrid
    })
  }

  // Visualize algorithm when trigger changes
  useEffect(() => {
    if (visualizeTrigger === 0) return
    if (typeof setIsRunning === 'function') setIsRunning(true)

    const start = grid[startPos.row][startPos.col]
    const end = grid[endPos.row][endPos.col]

    // deep copy grid state for algorithm
    const gridForAlgo = grid.map(row => row.map(n => ({...n, previousNode: null, isVisited:false, distance: Infinity, f: Infinity, g: Infinity, h: Infinity})))

    let result
    if (algorithm === 'BFS') result = runBFS(gridForAlgo, start, end)
    else if (algorithm === 'DFS') result = runDFS(gridForAlgo, start, end)
    else if (algorithm === 'Dijkstra') result = runDijkstra(gridForAlgo, start, end)
    else if (algorithm === 'A*') result = runAStar(gridForAlgo, start, end)

    if (stepMode) {
      // queue nodes and allow external step triggers to advance
      visitedRef.current = result.visitedNodesInOrder
      pathRef.current = result.nodesInShortestPathOrder
      setVisitedIndex(0)
      setPathIndex(0)
      // keep running state until queues are exhausted by stepTrigger increments
    } else {
      animateResult(result.visitedNodesInOrder, result.nodesInShortestPathOrder)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualizeTrigger, stepMode])

  // Advance one step when parent increments stepTrigger (Step Mode)
  useEffect(() => {
    if (!stepMode) return

    // reveal next visited node if available
    if (visitedIndex < visitedRef.current.length) {
      const node = visitedRef.current[visitedIndex]
      setGrid(prev => {
        const current = prev[node.row][node.col]
        if (current.isStart || current.isEnd || current.isVisited) return prev
        const newGrid = prev.map(r => r.map(n => ({...n})))
        const target = newGrid[node.row][node.col]
        target.isVisited = true
        return newGrid
      })
      setVisitedIndex(i => i + 1)
      // if finished and no path left, clear running
      if (visitedIndex + 1 >= visitedRef.current.length && pathIndex >= pathRef.current.length) {
        if (typeof setIsRunning === 'function') setIsRunning(false)
      }
      return
    }

    // reveal next path node if visited done
    if (pathIndex < pathRef.current.length) {
      const node = pathRef.current[pathIndex]
      setGrid(prev => {
        const current = prev[node.row][node.col]
        if (current.isStart || current.isEnd || current.isPath) return prev
        const newGrid = prev.map(r => r.map(n => ({...n})))
        const target = newGrid[node.row][node.col]
        target.isPath = true
        target.isVisited = false
        return newGrid
      })
      setPathIndex(i => i + 1)
      if (visitedIndex >= visitedRef.current.length && pathIndex + 1 >= pathRef.current.length) {
        if (typeof setIsRunning === 'function') setIsRunning(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepTrigger, stepMode])

  // keyboard support: Space to advance when stepMode is on; s/e/w to set placing
  useEffect(() => {
    function onKey(e) {
      if (e.key === ' ') {
        if (stepMode && typeof onStepNext === 'function') {
          e.preventDefault()
          onStepNext()
        }
      }
      if (e.key === 's') placing.current = 'start'
      if (e.key === 'e') placing.current = 'end'
      if (e.key === 'w') placing.current = 'wall'
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stepMode, onStepNext])

  function animateResult(visited, path) {
    // animate visited nodes sequentially
    visited.forEach((node, i) => {
      setTimeout(() => {
        setGrid(prev => {
          const newGrid = prev.map(r => r.map(n => ({...n})))
          const target = newGrid[node.row][node.col]
          if (!target.isStart && !target.isEnd) target.isVisited = true
          return newGrid
        })
      }, i * speed)
    })

    // after visited animation, animate path
    const delay = visited.length * speed + 60
    path.forEach((node, i) => {
      setTimeout(() => {
        setGrid(prev => {
          const newGrid = prev.map(r => r.map(n => ({...n})))
          const target = newGrid[node.row][node.col]
          if (!target.isStart && !target.isEnd) {
            target.isPath = true
            target.isVisited = false
          }
          return newGrid
        })
      }, delay + i * (speed + 20))
    })

    // finish running state after animations complete
    const totalTime = delay + path.length * (speed + 20) + 120
    if (typeof setIsRunning === 'function') {
      setTimeout(() => setIsRunning(false), totalTime)
    }
  }

  return (
    <div>
      <div className="overflow-auto p-4 rounded bg-gray-800 shadow-lg">
        <div style={{ ['--cols']: cols }} className={`grid-container`}>
          {grid.flat().map(node => (
            <Node key={`${node.row}-${node.col}`} node={node} onMouseDown={handleMouseDown} onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} />
          ))}
        </div>
      </div>
    </div>
  )
}
