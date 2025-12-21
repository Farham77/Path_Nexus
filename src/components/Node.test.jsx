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
import { render, screen } from '@testing-library/react'
import Node from './Node'

test('Node renders start/end/wall/visited/path states', () => {
  const base = { row: 0, col: 0 }
  const { container: c1 } = render(<Node node={{ ...base, isStart: true }} onMouseDown={() => { }} onMouseEnter={() => { }} onMouseUp={() => { }} />)
  expect(c1.firstChild.classList.contains('bg-start')).toBe(true)

  const { container: c2 } = render(<Node node={{ ...base, isEnd: true }} onMouseDown={() => { }} onMouseEnter={() => { }} onMouseUp={() => { }} />)
  expect(c2.firstChild.classList.contains('bg-end')).toBe(true)

  const { container: c3 } = render(<Node node={{ ...base, isWall: true }} onMouseDown={() => { }} onMouseEnter={() => { }} onMouseUp={() => { }} />)
  expect(c3.firstChild.classList.contains('bg-wall')).toBe(true)

  const { container: c4 } = render(<Node node={{ ...base, isVisited: true }} onMouseDown={() => { }} onMouseEnter={() => { }} onMouseUp={() => { }} />)
  expect(c4.firstChild.querySelector('.visited-pulse')).toBeTruthy()

  const { container: c5 } = render(<Node node={{ ...base, isPath: true }} onMouseDown={() => { }} onMouseEnter={() => { }} onMouseUp={() => { }} />)
  expect(c5.firstChild.querySelector('.bg-path')).toBeTruthy()
})
