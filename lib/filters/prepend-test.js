import test from 'ava'

import prepend from './prepend'

test('should exist', (t) => {
  t.is(typeof prepend, 'function')
})

test('should prepend to value', (t) => {
  const value = 'news'
  const arg = 'section_'

  const ret = prepend(value, arg)

  t.is(ret, 'section_news')
})

test('should not prepend to null', (t) => {
  const value = null
  const arg = 'section_'

  const ret = prepend(value, arg)

  t.is(ret, null)
})

test('should not prepend to empty string', (t) => {
  const value = ''
  const arg = 'section_'

  const ret = prepend(value, arg)

  t.is(ret, '')
})

test('should not prepend to zero', (t) => {
  const value = 0
  const arg = 'section_'

  const ret = prepend(value, arg)

  t.is(ret, 'section_0')
})

test('should not prepend with null', (t) => {
  const value = 'news'
  const arg = null

  const ret = prepend(value, arg)

  t.is(ret, 'news')
})
