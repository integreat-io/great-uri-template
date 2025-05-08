import test from 'node:test'
import assert from 'node:assert/strict'

import upper from './upper.js'

// Tests

test('should upper case value', () => {
  const value = 'CamelCase'

  const ret = upper(value)

  assert.equal(ret, 'CAMELCASE')
})

test('should not upper case null', () => {
  const value = null

  const ret = upper(value)

  assert.equal(ret, null)
})

test('should coerce to string', () => {
  const value = {}

  const ret = upper(value)

  assert.equal(ret, '[OBJECT OBJECT]')
})
