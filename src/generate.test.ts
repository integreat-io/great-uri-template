import test from 'node:test'
import assert from 'node:assert/strict'
import type { CompiledFilter, CompiledTemplate } from './types.js'

import generate from './generate.js'

// Tests

test('should generate with simple parameter replacement', () => {
  const compiled = [
    'http://example.com/',
    { param: 'type' },
    ':',
    { param: 'id' },
  ]
  const params = { id: 'ent1', type: 'entry' }
  const expected = 'http://example.com/entry:ent1'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate with optional parameter', () => {
  const compiled = [
    'http://example.com/',
    { param: 'type' },
    '/',
    { param: 'id', optional: true },
  ]
  const params = { type: 'entry' }
  const expected = 'http://example.com/entry/'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should not throw when no parameters', () => {
  const compiled = ['http://example.com/', { param: 'id', optional: true }]
  const expected = 'http://example.com/'

  const ret = generate(compiled)

  assert.equal(ret, expected)
})

test('should throw when missing required parameter', () => {
  const compiled = [
    'http://example.com/',
    { param: 'type' },
    '/',
    { param: 'id' },
  ]
  const params = { type: 'entry' }

  assert.throws(() => {
    generate(compiled, params)
  })
})

test('should generate from list of parameters', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    [null, { param: 'first' }, { param: 'second' }],
  ]
  const params = { first: 1, second: 2 }
  const expected = 'http://example.com/1,2'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate query component', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    ['?', { param: 'first' }, { param: 'max' }],
  ]
  const params = { first: 0, max: 20 }
  const expected = 'http://example.com/?first=0&max=20'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate with specific key', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    ['?', { param: 'first', key: 'page' }, { param: 'max' }],
  ]
  const params = { first: 0, max: 20 }
  const expected = 'http://example.com/?page=0&max=20'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate optional query component', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    ['?', { param: 'first', optional: true }, { param: 'max' }],
  ]
  const params = { max: 20 }
  const expected = 'http://example.com/?max=20'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate query component with array', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    ['?', { param: 'ids' }],
  ]
  const params = { ids: ['ent1', 'ent2', 'ent5'] }
  const expected = 'http://example.com/?ids=ent1,ent2,ent5'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate query continuation', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/?id=ent1',
    ['&', { param: 'first' }, { param: 'max' }],
  ]
  const params = { first: 0, max: 20 }
  const expected = 'http://example.com/?id=ent1&first=0&max=20'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate path segment', () => {
  const compiled: CompiledTemplate = [
    'http://example.com',
    [
      '/',
      { param: 'user', explode: true },
      { param: 'folders', explode: true },
    ],
  ]
  const params = { user: 'johnf', folders: ['home', 'pictures'] }
  const expected = 'http://example.com/johnf/home/pictures'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate fragment expansion', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    ['#', { param: 'anchor' }],
  ]
  const params = { anchor: 'header' }
  const expected = 'http://example.com/#header'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate fragment expansion with array', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    ['#', { param: 'anchor' }],
  ]
  const params = { anchor: ['header', 'one'] }
  const expected = 'http://example.com/#header,one'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate dot prefix', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/index',
    ['.', { param: 'postfix', explode: true }],
  ]
  const params = { postfix: ['old', 'html'] }
  const expected = 'http://example.com/index.old.html'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate path-style parameter expansion', () => {
  const compiled: CompiledTemplate = [
    [';', { param: 'first' }, { param: 'second' }],
  ]
  const params = { first: 1, second: 2 }
  const expected = ';first=1;second=2'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate with reserved expension', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    ['+', { param: 'folders' }],
  ]
  const params = { folders: 'path/to/something/' }
  const expected = 'http://example.com/path/to/something/'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate path-style parameter expansion with array', () => {
  const compiled: CompiledTemplate = [[';', { param: 'first' }]]
  const params = { first: [1, 2] }
  const expected = ';first=1,2'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate with filter function', () => {
  const appendFilter: CompiledFilter = {
    function: (value, arg) => value + arg,
    args: ['_archive'],
  }
  const compiled = [
    'http://example.com/',
    { param: 'section', filters: [appendFilter] },
  ]
  const params = { section: 'news' }
  const expected = 'http://example.com/news_archive'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should force numbers to string before using them in a filter', () => {
  const appendFilter: CompiledFilter = {
    function: (value, arg) => value + arg,
    args: ['_archive'],
  }
  const compiled = [
    'http://example.com/',
    { param: 'section', filters: [appendFilter] },
  ]
  const params = { section: 21 }
  const expected = 'http://example.com/21_archive'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate with several filter functions', () => {
  const maxFilter: CompiledFilter = {
    function: (value, length) =>
      (value as string).substring(0, Number.parseInt(length)),
    args: ['3'],
  }
  const appendFilter: CompiledFilter = {
    function: (value, string) => value + string,
    args: ['_archive'],
  }
  const compiled = [
    'http://example.com/',
    {
      param: 'section',
      filters: [maxFilter, appendFilter],
    },
  ]
  const params = { section: 'news' }
  const expected = 'http://example.com/new_archive'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should generate with filter function and no arguments', () => {
  const lowerFilter: CompiledFilter = {
    function: (value) => (value as string).toLowerCase(),
  }
  const compiled = [
    'http://example.com/',
    { param: 'section', filters: [lowerFilter] },
  ]
  const params = { section: 'News' }
  const expected = 'http://example.com/news'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should skip filters without function', () => {
  const appendFilter: CompiledFilter = {
    function: (value, string) => value + string,
    args: ['_archive'],
  }
  const compiled = [
    'http://example.com/',
    {
      param: 'section',
      filters: [{ function: 'illegal' }, appendFilter],
    },
  ]
  const params = { section: 'news' }
  const expected = 'http://example.com/news_archive'

  const ret = generate(compiled as unknown as CompiledTemplate, params) // Force type as we are giving it something invalid

  assert.equal(ret, expected)
})

test('should uri encode', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    { param: 'type' },
    ' ',
    { param: 'id' },
    ['?', { param: 'texts' }],
    '#main_content',
  ]
  const params = {
    id: 'ent1',
    type: 'entry',
    texts: ['Første test', 'Andre tekst'],
  }
  const expected =
    'http://example.com/entry%20ent1?texts=F%C3%B8rste%20test,Andre%20tekst#main_content'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should handle numbers in param arrays', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    { param: 'type' },
    ' ',
    { param: 'id' },
    ['?', { param: 'texts' }],
    '#main_content',
  ]
  const params = {
    id: 'ent1',
    type: 'entry',
    texts: [1, 2],
  }
  const expected = 'http://example.com/entry%20ent1?texts=1,2#main_content'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should expand Date as ISO string', () => {
  const compiled: CompiledTemplate = [
    'http://example.com/',
    ['?', { param: 'updatedAfter' }],
  ]
  const params = { updatedAfter: new Date('2017-05-12T18:43:00.000Z') }
  const expected =
    'http://example.com/?updatedAfter=2017-05-12T18%3A43%3A00.000Z'

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})

test('should return empty string when no template', () => {
  const compiled = null
  const params = {}
  const expected = ''

  const ret = generate(compiled, params)

  assert.equal(ret, expected)
})
