import test from 'ava'

import lower from './lower'

test('should exist', (t) => {
  t.is(typeof lower, 'function')
})

test('should lower case value', (t) => {
  const value = 'CamelCase'

  const ret = lower(value)

  t.is(ret, 'camelcase')
})

test('should not lower case null', (t) => {
  const value = null

  const ret = lower(value)

  t.is(ret, null)
})

test('should coerce to string', (t) => {
  const value = {}

  const ret = lower(value)

  t.is(ret, '[object object]')
})
