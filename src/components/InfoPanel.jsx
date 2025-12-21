import React from 'react'

export default function InfoPanel() {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow mb-4 text-sm text-gray-300">
      <h2 className="font-semibold text-lg mb-2">About PATH NEXUS</h2>
      <p className="mb-2">Visualize classic graph search algorithms (BFS, DFS, Dijkstra, A*). Use Step Mode to advance the exploration manually and learn how each algorithm traverses the grid.</p>
      <p className="text-xs text-gray-400">Keyboard: <span className="font-mono">s</span> place Start, <span className="font-mono">e</span> place End, <span className="font-mono">w</span> toggle Walls, <span className="font-mono">p</span> place Weights, <span className="font-mono">space</span> advance step (when Step Mode is ON).</p>
    </div>
  )
}
