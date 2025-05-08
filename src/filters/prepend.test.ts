import test from 'node:test'
import assert from 'node:assert/strict'

import prepend from './prepend.js'

// Tests

test('should prepend to value', () => {
  const value = 'news'
  const arg = 'section_'

  const ret = prepend(value, arg)

  assert.equal(ret, 'section_news')
})

test('should not prepend to null', () => {
  const value = null
  const arg = 'section_'

  const ret = prepend(value, arg)

  assert.equal(ret, null)
})

test('should not prepend to empty string', () => {
  const value = ''
  const arg = 'section_'

  const ret = prepend(value, arg)

  assert.equal(ret, '')
})

test('should not prepend to zero', () => {
  const value = 0
  const arg = 'section_'

  const ret = prepend(value, arg)

  assert.equal(ret, 'section_0')
})

test('should not prepend with null', () => {
  const value = 'news'
  const arg = null

  const ret = prepend(value, arg)

  assert.equal(ret, 'news')
})
