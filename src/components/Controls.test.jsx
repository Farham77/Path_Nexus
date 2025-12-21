import { test, expect, vi } from 'vitest'
import { JSDOM } from 'jsdom'
// Ensure a minimal DOM exists for this component test
if (typeof document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')
  global.window = dom.window
  global.document = dom.window.document
  global.navigator = { userAgent: 'node' }
}
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Controls from './Controls'

test('Clear Weights button calls onClearWeights and Place Weights toggles placingMode', () => {
  const mock = () => {}
  const props = {
    algorithm: 'BFS', setAlgorithm: mock, onVisualize: mock, onClearGrid: mock,
    speed: 30, setSpeed: mock, isRunning: false,
    stepMode: false, onToggleStepMode: mock, onStepNext: mock,
    rows: 20, cols: 20, setRows: mock, setCols: mock, onSetGridSize: mock,
    selectedWeight: 5, setSelectedWeight: mock, placingMode: 'wall', setPlacingMode: vi.fn(), onClearWeights: vi.fn()
  }

  const { getByRole } = render(<Controls {...props} />)

  // Clear Weights button exists and triggers handler
  const clearBtn = getByRole('button', { name: /clear all weights/i })
  fireEvent.click(clearBtn)
  expect(props.onClearWeights).toHaveBeenCalled()

  // Place Weights toggle should call setPlacingMode to 'weight' when clicked
  const toggle = getByRole('button', { name: /place weights/i })
  fireEvent.click(toggle)
  expect(props.setPlacingMode).toHaveBeenCalled()
})