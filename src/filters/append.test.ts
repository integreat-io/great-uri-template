import test from 'node:test'
import assert from 'node:assert/strict'

import append from './append.js'

// Tests

test('should append to value', () => {
  const value = 'news'
  const arg = '_archive'

  const ret = append(value, arg)

  assert.equal(ret, 'news_archive')
})

test('should append to 0', () => {
  const value = 0
  const arg = '_archive'

  const ret = append(value, arg)

  assert.equal(ret, '0_archive')
})

test('should not append to null', () => {
  const value = null
  const arg = '_archive'

  const ret = append(value, arg)

  assert.equal(ret, null)
})

test('should not append to empty string', () => {
  const value = ''
  const arg = '_archive'

  const ret = append(value, arg)

  assert.equal(ret, '')
})

test('should not append with null', () => {
  const value = 'news'
  const arg = null

  const ret = append(value, arg)

  assert.equal(ret, 'news')
})
