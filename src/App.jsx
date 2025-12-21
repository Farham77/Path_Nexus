import React, { useState, useEffect, useCallback } from 'react'
import Grid from './components/Grid'
import Controls from './components/Controls'
import InfoPanel from './components/InfoPanel'

// App: Top-level application. Handles global state like grid size and control triggers
export default function App() {
  const [rows, setRows] = useState(20)
  const [cols, setCols] = useState(40)
  const [startPos, setStartPos] = useState({row: 10, col: 4})
  const [endPos, setEndPos] = useState({row: 10, col: 35})
  const [algorithm, setAlgorithm] = useState('BFS')
  const [visualizeTrigger, setVisualizeTrigger] = useState(0)
  const [clearGridTrigger, setClearGridTrigger] = useState(0)
  const [speed, setSpeed] = useState(30)
  const [isRunning, setIsRunning] = useState(false)

  // Weight & placing mode state
  const [selectedWeight, setSelectedWeight] = useState(5)
  const [placingMode, setPlacingMode] = useState('wall') // 'wall' | 'start' | 'end' | 'weight'

  // Step mode state (lifted here so Controls and Grid stay in sync)
  const [stepMode, setStepMode] = useState(false)
  const [stepTrigger, setStepTrigger] = useState(0)
  const onToggleStepMode = useCallback(() => setStepMode(s => !s), [])
  const onStepNext = useCallback(() => setStepTrigger(t => t + 1), [])

  // allow dynamic resizing later (lazily)
  const onVisualize = useCallback(() => setVisualizeTrigger(t => t + 1), [])
  const onClearGrid = useCallback(() => {
    setClearGridTrigger(t => t + 1)
    setIsRunning(false)
  }, [setIsRunning])

  // Grid sizing helper: updates dimensions, clamps start/end, and resets grid
  const onSetGridSize = useCallback((newRows, newCols) => {
    setRows(newRows)
    setCols(newCols)
    setStartPos(prev => ({ row: Math.min(prev.row, newRows - 1), col: Math.min(prev.col, newCols - 1) }))
    setEndPos(prev => ({ row: Math.min(prev.row, newRows - 1), col: Math.min(prev.col, newCols - 1) }))
    setClearGridTrigger(t => t + 1)
    setIsRunning(false)
  }, [setRows, setCols, setStartPos, setEndPos, setClearGridTrigger, setIsRunning])

  // Clear weights and reset placing mode
  const onClearWeights = useCallback(() => {
    // Rebuild a clean grid (weights are reset to default by createEmptyGrid)
    setClearGridTrigger(t => t + 1)
    setIsRunning(false)
    setPlacingMode('wall')
  }, [setClearGridTrigger, setIsRunning, setPlacingMode])

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">PATH NEXUS  Path Finder Visualizer</h1>
        <div className="text-sm text-gray-400">Discrete Mathematics  Graph Visualization</div>
      </header>

      <main className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-96">
          <InfoPanel />
          <Controls
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            onVisualize={onVisualize}
            onClearGrid={onClearGrid}
            speed={speed}
            setSpeed={setSpeed}
            isRunning={isRunning}
            rows={rows}
            cols={cols}
            setRows={setRows}
            setCols={setCols}
            onSetGridSize={onSetGridSize}
            onClearWeights={onClearWeights}
            stepMode={stepMode}
            onToggleStepMode={onToggleStepMode}
            onStepNext={onStepNext}
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
            placingMode={placingMode}
            setPlacingMode={setPlacingMode}
          />
        </aside>

        <section className="flex-1 min-w-0">
          <Grid
            rows={rows}
            cols={cols}
            startPos={startPos}
            endPos={endPos}
            setStartPos={setStartPos}
            setEndPos={setEndPos}
            algorithm={algorithm}
            visualizeTrigger={visualizeTrigger}
            clearGridTrigger={clearGridTrigger}
            speed={speed}
            setIsRunning={setIsRunning}
            stepMode={stepMode}
            stepTrigger={stepTrigger}
            onStepNext={onStepNext}
            selectedWeight={selectedWeight}
            placingMode={placingMode}
          />
        </section>
      </main>

      <footer className="text-xs text-gray-400">Designed for Discrete Mathematics demos  Ready to deploy on Vercel</footer>
    </div>
  )
}
