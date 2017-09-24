import test from 'ava'

import splitComponent from './splitComponent'

test('should exist', (t) => {
  t.is(typeof splitComponent, 'function')
})

test('should return empty array when no component', (t) => {
  const component = null
  const expected = []

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should return empty array when no parameters', (t) => {
  const component = '{}'
  const expected = []

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split component into modifier and params', (t) => {
  const component = '{id}'
  const expected = [null, 'id']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split several params', (t) => {
  const component = '{first,max}'
  const expected = [null, 'first', 'max']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with query modifier', (t) => {
  const component = '{?first,max}'
  const expected = ['?', 'first', 'max']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with query continuation modifier', (t) => {
  const component = '{&first,max}'
  const expected = ['&', 'first', 'max']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with path modifier', (t) => {
  const component = '{/first,max}'
  const expected = ['/', 'first', 'max']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with fragment modifier', (t) => {
  const component = '{#first,max}'
  const expected = ['#', 'first', 'max']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with dot modifier', (t) => {
  const component = '{.first,max}'
  const expected = ['.', 'first', 'max']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with path-style modifier', (t) => {
  const component = '{;first,max}'
  const expected = [';', 'first', 'max']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with reserved expansion modifier', (t) => {
  const component = '{+folders}'
  const expected = ['+', 'folders']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with filter function', (t) => {
  const component = '{/section|max(3),user}'
  const expected = ['/', 'section|max(3)', 'user']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})

test('should split with filter function several args', (t) => {
  const component = '{/section,type|map(entry=entries,article=articles)}'
  const expected = ['/', 'section', 'type|map(entry=entries,article=articles)']

  const ret = splitComponent(component)

  t.deepEqual(ret, expected)
})
