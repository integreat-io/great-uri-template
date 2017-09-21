import test from 'ava'

import max from './max'

test('should exist', (t) => {
  t.is(typeof max, 'function')
})

test('should return 3 first chars', (t) => {
  const value = 'entertainment'
  const length = 3

  const ret = max(value, length)

  t.is(ret, 'ent')
})

test('should handle length given as a string', (t) => {
  const value = 'entertainment'
  const length = '3'

  const ret = max(value, length)

  t.is(ret, 'ent')
})

test('should return value when length is higher than number of chars', (t) => {
  const value = 'entertainment'
  const length = 20

  const ret = max(value, length)

  t.is(ret, 'entertainment')
})

test('should return null', (t) => {
  const value = null
  const length = 3

  const ret = max(value, length)

  t.is(ret, null)
})

test('should coerce value to a string', (t) => {
  const value = {}
  const length = 3

  const ret = max(value, length)

  t.is(ret, '[ob')
})

test('should return value when length is not a number', (t) => {
  const value = 'entertainment'
  const length = 'something'

  const ret = max(value, length)

  t.is(ret, 'entertainment')
})
