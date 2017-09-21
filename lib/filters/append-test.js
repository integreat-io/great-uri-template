import test from 'ava'

import append from './append'

test('should exist', (t) => {
  t.is(typeof append, 'function')
})

test('should append to value', (t) => {
  const value = 'news'
  const arg = '_archive'

  const ret = append(value, arg)

  t.is(ret, 'news_archive')
})

test('should not append to null', (t) => {
  const value = null
  const arg = '_archive'

  const ret = append(value, arg)

  t.is(ret, null)
})

test('should not append to empty string', (t) => {
  const value = ''
  const arg = '_archive'

  const ret = append(value, arg)

  t.is(ret, '')
})

test('should not append to zero', (t) => {
  const value = 0
  const arg = '_archive'

  const ret = append(value, arg)

  t.is(ret, '0_archive')
})

test('should not append with null', (t) => {
  const value = 'news'
  const arg = null

  const ret = append(value, arg)

  t.is(ret, 'news')
})
