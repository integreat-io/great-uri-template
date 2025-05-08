import test from 'node:test'
import assert from 'node:assert/strict'

import map from './map.js'

// Tests

test('should map value', () => {
  const value = 'entry'
  const args = ['account=accounts', 'entry=entries']

  const ret = map(value, ...args)

  assert.equal(ret, 'entries')
})

test('should return value when no match', () => {
  const value = 'entry'
  const args = ['account=accounts']

  const ret = map(value, ...args)

  assert.equal(ret, 'entry')
})

test('should return value when no mappings', () => {
  const value = 'entry'

  const ret = map(value)

  assert.equal(ret, 'entry')
})

test('should not map null value', () => {
  const value = null
  const args = ['null=nope']

  const ret = map(value, ...args)

  assert.equal(ret, null)
})
