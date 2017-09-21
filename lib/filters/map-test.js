import test from 'ava'

import map from './map'

test('should exist', (t) => {
  t.is(typeof map, 'function')
})

test('should map value', (t) => {
  const value = 'entry'
  const args = [
    'account=accounts',
    'entry=entries'
  ]

  const ret = map(value, ...args)

  t.is(ret, 'entries')
})

test('should return value when no match', (t) => {
  const value = 'entry'
  const args = ['account=accounts']

  const ret = map(value, ...args)

  t.is(ret, 'entry')
})

test('should return value when no mappings', (t) => {
  const value = 'entry'

  const ret = map(value)

  t.is(ret, 'entry')
})

test('should not map null value', (t) => {
  const value = null
  const args = ['null=nope']

  const ret = map(value, ...args)

  t.is(ret, null)
})
