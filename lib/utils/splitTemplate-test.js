import test from 'ava'

import splitTemplate from './splitTemplate'

test('should exist', (t) => {
  t.is(typeof splitTemplate, 'function')
})

test('should return empty array when no template', (t) => {
  const template = null
  const expected = []

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template', (t) => {
  const template = 'http://example.com/{type}/all{?first,max}'
  const expected = [
    'http://example.com/',
    '{type}',
    '/all',
    '{?first,max}'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template starting with param', (t) => {
  const template = '{host}/all'
  const expected = [
    '{host}',
    '/all'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template with escaped brackets', (t) => {
  const template = 'http://example.com/\\{weird\\}/all'
  const expected = [
    'http://example.com/\\{weird\\}/all'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template with escaped brackets and param', (t) => {
  const template = 'http://example.com/\\{weird\\}/{type}'
  const expected = [
    'http://example.com/\\{weird\\}/',
    '{type}'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template with filter functions', (t) => {
  const template = 'http://example.com/{type|lower|map(entry=entries,article=articles)}/{id}'
  const expected = [
    'http://example.com/',
    '{type|lower|map(entry=entries,article=articles)}',
    '/',
    '{id}'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template with filter functions and escaped brackets', (t) => {
  const template = 'http://example.com/{keys=ids|wrap([, ", ", \\,\\{\\}])}'
  const expected = [
    'http://example.com/',
    '{keys=ids|wrap([, ", ", \\,\\{\\}])}'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template at query string', (t) => {
  const template = 'http://example.com/{type}/all?first=0'
  const expected = [
    'http://example.com/',
    '{type}',
    '/all',
    '?first=0'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template when only query string', (t) => {
  const template = '?first=0'
  const expected = [
    '?first=0'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template at hash', (t) => {
  const template = 'http://example.com/{type}/all#content'
  const expected = [
    'http://example.com/',
    '{type}',
    '/all',
    '#content'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})

test('should split template at query string and hash', (t) => {
  const template = 'http://example.com/{type}/all?first=20#content'
  const expected = [
    'http://example.com/',
    '{type}',
    '/all',
    '?first=20',
    '#content'
  ]

  const ret = splitTemplate(template)

  t.deepEqual(ret, expected)
})
