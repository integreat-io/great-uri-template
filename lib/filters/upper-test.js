import test from 'ava'

import upper from './upper'

test('should exist', (t) => {
  t.is(typeof upper, 'function')
})

test('should upper case value', (t) => {
  const value = 'CamelCase'

  const ret = upper(value)

  t.is(ret, 'CAMELCASE')
})

test('should not upper case null', (t) => {
  const value = null

  const ret = upper(value)

  t.is(ret, null)
})

test('should coerce to string', (t) => {
  const value = {}

  const ret = upper(value)

  t.is(ret, '[OBJECT OBJECT]')
})
