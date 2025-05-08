import test from 'node:test'
import assert from 'node:assert/strict'
import type { FilterValue } from '../types.js'

import lower from './lower.js'

// Tests

test('should lower case value', () => {
  const value = 'CamelCase'

  const ret = lower(value)

  assert.equal(ret, 'camelcase')
})

test('should not lower case null', () => {
  const value = null

  const ret = lower(value)

  assert.equal(ret, null)
})

test('should coerce to string', () => {
  const value = {}

  const ret = lower(value as FilterValue)

  assert.equal(ret, '[object object]')
})
