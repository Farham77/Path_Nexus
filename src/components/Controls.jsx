import React from 'react'

export default function Controls({ algorithm, setAlgorithm, onVisualize, onClearGrid, speed, setSpeed, isRunning, stepMode, onToggleStepMode, onStepNext, rows, cols, setRows, setCols, onSetGridSize, selectedWeight, setSelectedWeight, placingMode, setPlacingMode, onClearWeights }) {
  const customRowsRef = React.useRef(null)
  const customColsRef = React.useRef(null)
  const weightInputRef = React.useRef(null)
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
      <div>
        <label className="block text-sm text-gray-300 mb-2">Algorithm</label>
        <select value={algorithm} onChange={e => setAlgorithm(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded">
          <option>BFS</option>
          <option>DFS</option>
          <option>Dijkstra</option>
          <option>A*</option>
        </select>
      </div>

      {/* Grid Size selector */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Grid Size</label>
        <select
          value={`${rows}x${cols}`}
          onChange={e => {
            const [r, c] = e.target.value.split('x').map(Number)
            onSetGridSize(r, c)
          }}
          disabled={isRunning}
          className="w-full bg-gray-700 text-white p-2 rounded mb-2"
        >
          <option value="20x20">20 × 20</option>
          <option value="30x30">30 × 30</option>
          <option value="40x40">40 × 40</option>
          <option value="20x40">20 × 40</option>
          <option value="40x20">40 × 20</option>
        </select>

        <div className="flex gap-2">
          <input
            ref={customRowsRef}
            type="number"
            min="5"
            max="120"
            defaultValue={rows}
            aria-label="custom rows"
            className="w-1/2 bg-gray-700 p-2 rounded text-white"
          />
          <input
            ref={customColsRef}
            type="number"
            min="5"
            max="200"
            defaultValue={cols}
            aria-label="custom cols"
            className="w-1/2 bg-gray-700 p-2 rounded text-white"
          />
        </div>
        <div className="mt-2">
          <button
            onClick={() => {
              const r = Number(customRowsRef.current?.value || rows)
              const c = Number(customColsRef.current?.value || cols)
              onSetGridSize(Math.max(5, Math.floor(r)), Math.max(5, Math.floor(c)))
            }}
            disabled={isRunning}
            className="py-1 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-xs"
          >
            Apply Size
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">Animation Speed</label>
        <input
          type="range"
          min="5"
          max="120"
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-gray-300 mt-1">{speed} ms per step</div>
      </div>

      <div className="flex gap-2">
        <button disabled={isRunning} onClick={onVisualize} className={`flex-1 py-2 rounded font-medium ${isRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}>
          {isRunning ? 'Running...' : 'Visualize'}
        </button>
        <button onClick={onClearGrid} className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded font-medium">Reset</button>
      </div>

      <div className="text-xs text-gray-400">Controls: click to place Start / End. Click & drag to place Walls.</div>

      <div className="flex items-center gap-2">
        <button onClick={onToggleStepMode} className={`py-1 px-2 rounded text-xs ${stepMode ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>{stepMode ? 'Step Mode: ON' : 'Step Mode: OFF'}</button>
        <button onClick={onStepNext} className="py-1 px-2 rounded text-xs bg-indigo-600 hover:bg-indigo-500">Step Next</button>
        <div className="text-xs text-gray-400 ml-2">(Space advances when Step Mode is ON)</div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setPlacingMode(placingMode === 'weight' ? 'wall' : 'weight')} aria-pressed={placingMode === 'weight'} className={`py-1 px-2 rounded text-xs ${placingMode === 'weight' ? 'bg-yellow-400 text-black' : 'bg-gray-700'}`}>
          {placingMode === 'weight' ? 'Place Weights: ON' : 'Place Weights: OFF'}
        </button>
        <input
          ref={weightInputRef}
          type="number"
          min="2"
          max="100"
          value={selectedWeight}
          onChange={e => setSelectedWeight(Math.max(2, Number(e.target.value) || 2))}
          className="w-20 bg-gray-700 p-2 rounded text-white text-xs"
          aria-label="weight value"
        />
        <button
          onClick={onClearWeights}
          disabled={isRunning}
          aria-label="Clear all weights"
          className="py-1 px-3 rounded bg-red-500 hover:bg-red-400 text-xs ml-2"
        >
          Clear Weights
        </button>
        <div className="text-xs text-gray-400 ml-2">Click to place weights (value shown on cell)</div>
      </div>

      <hr className="border-gray-700" />

      <div className="text-sm text-gray-300">Color guide</div>
      <div className="flex gap-2 items-center text-xs text-gray-300">
        <div className="w-4 h-4 bg-start rounded-sm"></div><span>Start</span>
        <div className="w-4 h-4 bg-end rounded-sm"></div><span>End</span>
        <div className="w-4 h-4 bg-wall rounded-sm"></div><span>Wall</span>
        <div className="w-4 h-4 bg-gradient-to-r from-visitedGradientStart to-visitedGradientEnd rounded-sm"></div><span>Visited</span>
        <div className="w-4 h-4 bg-path rounded-sm"></div><span>Path</span>
      </div>
    </div>
  )
}
