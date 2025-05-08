import test from 'node:test'
import assert from 'node:assert/strict'
import type { FilterValue } from '../types.js'

import max from './max.js'

// Tests

test('should return 3 first chars', () => {
  const value = 'entertainment'
  const length = 3

  const ret = max(value, length)

  assert.equal(ret, 'ent')
})

test('should handle length given as a string', () => {
  const value = 'entertainment'
  const length = '3'

  const ret = max(value, length)

  assert.equal(ret, 'ent')
})

test('should return value when length is higher than number of chars', () => {
  const value = 'entertainment'
  const length = 20

  const ret = max(value, length)

  assert.equal(ret, 'entertainment')
})

test('should return null', () => {
  const value = null
  const length = 3

  const ret = max(value, length)

  assert.equal(ret, null)
})

test('should coerce value to a string', () => {
  const value = {}
  const length = 3

  const ret = max(value as FilterValue, length)

  assert.equal(ret, '[ob')
})

test('should return value when length is not a number', () => {
  const value = 'entertainment'
  const length = 'something'

  const ret = max(value, length)

  assert.equal(ret, 'entertainment')
})
