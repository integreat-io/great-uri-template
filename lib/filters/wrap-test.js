import test from 'ava'

import wrap from './wrap'

test('should exist', (t) => {
  t.is(typeof wrap, 'function')
})

test('should wrap value', (t) => {
  const value = 'ent1'
  const args = ['"', '"']

  const ret = wrap(value, ...args)

  t.is(ret, '"ent1"')
})

test('should wrap array', (t) => {
  const value = ['ent1', 'ent3']
  const args = ['[', ']']

  const ret = wrap(value, ...args)

  t.is(ret, '[ent1,ent3]')
})

test('should wrap array and each element', (t) => {
  const value = ['ent1', 'ent3']
  const args = ['[', '"', '"', ']']

  const ret = wrap(value, ...args)

  t.is(ret, '["ent1","ent3"]')
})

test('should wrap value with inner and outer', (t) => {
  const value = 'ent1'
  const args = ['[', '"', '"', ']']

  const ret = wrap(value, ...args)

  t.is(ret, '["ent1"]')
})

test('should not wrap null', (t) => {
  const value = null
  const args = ['"', '"']

  const ret = wrap(value, ...args)

  t.is(ret, null)
})

test('should not wrap empty string', (t) => {
  const value = ''
  const args = ['"', '"']

  const ret = wrap(value, ...args)

  t.is(ret, '')
})

test('should not wrap when no parts', (t) => {
  const value = 'ent1'

  const ret = wrap(value)

  t.is(ret, 'ent1')
})
