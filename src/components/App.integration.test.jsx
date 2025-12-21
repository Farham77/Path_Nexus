import { test, expect } from 'vitest'
import { JSDOM } from 'jsdom'
// Ensure a minimal DOM exists for this component test
if (typeof document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')
  global.window = dom.window
  global.document = dom.window.document
  global.navigator = { userAgent: 'node' }
}
import React from 'react'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import App from '../App'

// Integration: place a weight on a cell, then clear weights and assert it's removed
test('placing then clearing weights updates the grid', async () => {
  const { getByRole, getByLabelText } = render(<App />)

  // Set weight value first
  const weightInput = getByLabelText('weight value')
  fireEvent.change(weightInput, { target: { value: '7' } })
  await waitFor(() => expect(weightInput.value).toBe('7'))

  // Turn on Place Weights
  const placeBtn = getByRole('button', { name: /place weights/i })
  fireEvent.click(placeBtn)
  // wait for UI to reflect placing mode change
  await waitFor(() => expect(getByRole('button', { name: /place weights: on/i })).toBeTruthy())

  // Click a target cell (row 1, col 1)
  const target = getByLabelText('cell 1-1')
  const weightVal = weightInput.value
  fireEvent.mouseDown(target)

  // Expect to see the weight badge inside that cell (matches current input)
  await waitFor(() => {
    expect(within(target).getByText(weightVal)).toBeTruthy()
  })

  // Click Clear Weights
  const clearBtn = getByRole('button', { name: /clear all weights/i })
  fireEvent.click(clearBtn)

  // Now the badge should be gone
  await waitFor(() => {
    expect(within(target).queryByText('7')).toBeNull()
  })
})