import test from 'node:test'
import assert from 'node:assert/strict'

import splitTemplate from './splitTemplate.js'

// Tests

test('should return empty array when no template', () => {
  const template = null
  const expected: string[] = []

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template', () => {
  const template = 'http://example.com/{type}/all{?first,max}'
  const expected = ['http://example.com/', '{type}', '/all', '{?first,max}']

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template starting with param', () => {
  const template = '{host}/all'
  const expected = ['{host}', '/all']

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template with escaped brackets', () => {
  const template = 'http://example.com/\\{weird\\}/all'
  const expected = ['http://example.com/\\{weird\\}/all']

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template with escaped brackets and param', () => {
  const template = 'http://example.com/\\{weird\\}/{type}'
  const expected = ['http://example.com/\\{weird\\}/', '{type}']

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template with filter functions', () => {
  const template =
    'http://example.com/{type|lower|map(entry=entries,article=articles)}/{id}'
  const expected = [
    'http://example.com/',
    '{type|lower|map(entry=entries,article=articles)}',
    '/',
    '{id}',
  ]

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template with filter functions and escaped brackets', () => {
  const template = 'http://example.com/{keys=ids|wrap([, ", ", \\,\\{\\}])}'
  const expected = [
    'http://example.com/',
    '{keys=ids|wrap([, ", ", \\,\\{\\}])}',
  ]

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template at query string', () => {
  const template = 'http://example.com/{type}/all?first=0'
  const expected = ['http://example.com/', '{type}', '/all', '?first=0']

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template when only query string', () => {
  const template = '?first=0'
  const expected = ['?first=0']

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template at hash', () => {
  const template = 'http://example.com/{type}/all#content'
  const expected = ['http://example.com/', '{type}', '/all', '#content']

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})

test('should split template at query string and hash', () => {
  const template = 'http://example.com/{type}/all?first=20#content'
  const expected = [
    'http://example.com/',
    '{type}',
    '/all',
    '?first=20',
    '#content',
  ]

  const ret = splitTemplate(template)

  assert.deepEqual(ret, expected)
})
