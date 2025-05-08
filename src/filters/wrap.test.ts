import test from 'node:test'
import assert from 'node:assert/strict'

import wrap from './wrap.js'

// Tests

test('should wrap value', () => {
  const value = 'ent1'
  const args = ['"', '"']

  const ret = wrap(value, ...args)

  assert.equal(ret, '"ent1"')
})

test('should wrap array', () => {
  const value = ['ent1', 'ent3']
  const args = ['[', ']']

  const ret = wrap(value, ...args)

  assert.equal(ret, '[ent1,ent3]')
})

test('should wrap array and each element', () => {
  const value = ['ent1', 'ent3']
  const args = ['[', '"', '"', ']']

  const ret = wrap(value, ...args)

  assert.equal(ret, '["ent1","ent3"]')
})

test('should wrap value with inner and outer', () => {
  const value = 'ent1'
  const args = ['[', '"', '"', ']']

  const ret = wrap(value, ...args)

  assert.equal(ret, '["ent1"]')
})

test('should not wrap null', () => {
  const value = null
  const args = ['"', '"']

  const ret = wrap(value, ...args)

  assert.equal(ret, null)
})

test('should not wrap empty string', () => {
  const value = ''
  const args = ['"', '"']

  const ret = wrap(value, ...args)

  assert.equal(ret, '')
})

test('should not wrap when no parts', () => {
  const value = 'ent1'

  const ret = wrap(value)

  assert.equal(ret, 'ent1')
})
