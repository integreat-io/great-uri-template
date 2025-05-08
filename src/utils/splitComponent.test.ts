import test from 'node:test'
import assert from 'node:assert/strict'

import splitComponent from './splitComponent.js'

// Tests

test('should return empty array when no component', () => {
  const component = null
  const expected: string[] = []

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should return empty array when no parameters', () => {
  const component = '{}'
  const expected: string[] = []

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split component into modifier and params', () => {
  const component = '{id}'
  const expected = [null, 'id']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split several params', () => {
  const component = '{first,max}'
  const expected = [null, 'first', 'max']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with query modifier', () => {
  const component = '{?first,max}'
  const expected = ['?', 'first', 'max']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with query continuation modifier', () => {
  const component = '{&first,max}'
  const expected = ['&', 'first', 'max']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with path modifier', () => {
  const component = '{/first,max}'
  const expected = ['/', 'first', 'max']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with fragment modifier', () => {
  const component = '{#first,max}'
  const expected = ['#', 'first', 'max']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with dot modifier', () => {
  const component = '{.first,max}'
  const expected = ['.', 'first', 'max']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with path-style modifier', () => {
  const component = '{;first,max}'
  const expected = [';', 'first', 'max']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with reserved expansion modifier', () => {
  const component = '{+folders}'
  const expected = ['+', 'folders']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with filter function', () => {
  const component = '{/section|max(3),user}'
  const expected = ['/', 'section|max(3)', 'user']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})

test('should split with filter function several args', () => {
  const component = '{/section,type|map(entry=entries,article=articles)}'
  const expected = ['/', 'section', 'type|map(entry=entries,article=articles)']

  const ret = splitComponent(component)

  assert.deepEqual(ret, expected)
})
