import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Node/Cell component - visualizes its state and animates transitions using Framer Motion
// Discrete Math: each cell represents a vertex in the underlying grid graph.
// Flags like `isVisited`, `isWall`, and `isPath` correspond to set-membership during algorithm execution.
export default function Node({ node, onMouseDown, onMouseEnter, onMouseUp }) {
  const { isStart, isEnd, isWall, isVisited, isPath } = node

  // 'relative' ensures absolute overlays (visited/path) are positioned inside this cell
  let classes = 'cell relative rounded-sm flex items-center justify-center'
  if (isStart) classes += ' bg-start'
  else if (isEnd) classes += ' bg-end'
  else if (isWall) classes += ' bg-wall'
  else if (node.weight && node.weight > 1) classes += ' bg-yellow-700'
  else classes += ' bg-gray-700'

  return (
    <div
      className={classes}
      style={{ width: 'var(--cell-size)', height: 'var(--cell-size)' }}
      onMouseDown={() => onMouseDown(node)}
      onMouseEnter={() => onMouseEnter(node)}
      onMouseUp={() => onMouseUp(node)}
      role="button"
      aria-label={`cell ${node.row}-${node.col}`}
    >
      {node.weight && node.weight > 1 && (
        <div className="absolute top-0 right-0 text-[10px] bg-yellow-200 text-black px-1 rounded-bl">{node.weight}</div>
      )}
      <AnimatePresence>
        {isVisited && !isPath && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 rounded-sm bg-gradient-to-br from-visitedGradientStart to-visitedGradientEnd visited-pulse"
            aria-hidden="true"
          />
        )}

        {isPath && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-sm bg-path"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
