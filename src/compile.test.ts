import test from 'node:test'
import assert from 'node:assert/strict'
import prepend from './filters/prepend.js'
import append from './filters/append.js'
import upper from './filters/upper.js'
import wrap from './filters/wrap.js'
import max from './filters/max.js'
import map from './filters/map.js'

import compile from './compile.js'

// Tests

test('should compile template with no parameters', () => {
  const template = 'http://example.com/list'
  const expected = ['http://example.com/list']

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile parameter replacement', () => {
  const template = 'http://example.com/{type}:{id}'
  const expected = [
    'http://example.com/',
    { param: 'type' },
    ':',
    { param: 'id' },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile parameter in the middle of the url', () => {
  const template = 'http://example.com/{section}/latest'
  const expected = ['http://example.com/', { param: 'section' }, '/latest']

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile escaped curly brackets as text', () => {
  const template = 'http://example.com/{type}?brackets=\\{\\}&page={first}'
  const expected = [
    'http://example.com/',
    { param: 'type' },
    '?brackets={}&page=',
    { param: 'first' },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile optional param', () => {
  const template = 'http://example.com/{required}/{optional?}'
  const expected = [
    'http://example.com/',
    { param: 'required' },
    '/',
    { param: 'optional', optional: true },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile list of params', () => {
  const template = 'http://example.com/{first,max}'
  const expected = [
    'http://example.com/',
    [null, { param: 'first' }, { param: 'max' }],
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile query component', () => {
  const template = 'http://example.com/{?first,max}'
  const expected = [
    'http://example.com/',
    ['?', { param: 'first' }, { param: 'max' }],
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile with specified key', () => {
  const template = 'http://example.com/{?page=first,max}'
  const expected = [
    'http://example.com/',
    ['?', { param: 'first', key: 'page' }, { param: 'max' }],
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile optional query component', () => {
  const template = 'http://example.com/{?first?,max}'
  const expected = [
    'http://example.com/',
    ['?', { param: 'first', optional: true }, { param: 'max' }],
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should explode path and dot expansion', () => {
  const template = 'http://example.com/{/folders}{.suffix}'
  const expected = [
    'http://example.com/',
    ['/', { param: 'folders', explode: true }],
    ['.', { param: 'suffix', explode: true }],
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile filter function', () => {
  const template = 'http://example.com/{folder|append(_archive)}'
  const expected = [
    'http://example.com/',
    { param: 'folder', filters: [{ function: append, args: ['_archive'] }] },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile several filter functions', () => {
  const template = 'http://example.com/{folder|append(_archive)|prepend(user_)}'
  const expected = [
    'http://example.com/',
    {
      param: 'folder',
      filters: [
        { function: append, args: ['_archive'] },
        { function: prepend, args: ['user_'] },
      ],
    },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile filter function with several args', () => {
  const template = 'http://example.com{?keys=ids|wrap([, ", ", ])}'
  const expected = [
    'http://example.com',
    [
      '?',
      {
        param: 'ids',
        key: 'keys',
        filters: [{ function: wrap, args: ['[', '"', '"', ']'] }],
      },
    ],
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile with escaped comma in args', () => {
  const template = 'http://example.com{?keys=ids|wrap([, ", ", \\,"extra"])}'
  const expected = [
    'http://example.com',
    [
      '?',
      {
        param: 'ids',
        key: 'keys',
        filters: [{ function: wrap, args: ['[', '"', '"', ',"extra"]'] }],
      },
    ],
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile filter function with no args', () => {
  const template = 'http://example.com/{folder|upper()}'
  const expected = [
    'http://example.com/',
    { param: 'folder', filters: [{ function: upper }] },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile filter function with no parens', () => {
  const template = 'http://example.com/{folder|upper}'
  const expected = [
    'http://example.com/',
    { param: 'folder', filters: [{ function: upper }] },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile prefix modifier', () => {
  const template = 'http://example.com/{section:1}/{section}'
  const expected = [
    'http://example.com/',
    { param: 'section', filters: [{ function: max, args: ['1'] }] },
    '/',
    { param: 'section' },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile prefix modifier before filter functions', () => {
  const template = 'http://example.com/{section:1|append(_archive)}'
  const expected = [
    'http://example.com/',
    {
      param: 'section',
      filters: [
        { function: max, args: ['1'] },
        { function: append, args: ['_archive'] },
      ],
    },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should compile filter function with equal sign in argument', () => {
  const template = 'http://example.com/{type|map(entry=entries)}'
  const expected = [
    'http://example.com/',
    { param: 'type', filters: [{ function: map, args: ['entry=entries'] }] },
  ]

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should return empty array when no template', () => {
  const template = null
  const expected: string[] = []

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should return empty array when empty string template', () => {
  const template = ''
  const expected: string[] = []

  const ret = compile(template)

  assert.deepEqual(ret, expected)
})

test('should throw for unclosed parameter', () => {
  const template = 'http://example.com/{type'

  assert.throws(() => {
    compile(template)
  })
})
