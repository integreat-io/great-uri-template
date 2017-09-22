import test from 'ava'
import prepend from './filters/prepend'
import append from './filters/append'
import upper from './filters/upper'
import wrap from './filters/wrap'
import max from './filters/max'
import map from './filters/map'

import compile from './compile'

test('should exist', (t) => {
  t.is(typeof compile, 'function')
})

test('should compile template with no parameters', (t) => {
  const template = 'http://example.com/list'
  const expected = ['http://example.com/list']

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile parameter replacement', (t) => {
  const template = 'http://example.com/{type}:{id}'
  const expected = ['http://example.com/', {param: 'type'}, ':', {param: 'id'}]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile parameter in the middle of the url', (t) => {
  const template = 'http://example.com/{section}/latest'
  const expected = ['http://example.com/', {param: 'section'}, '/latest']

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile escaped curly brackets as text', (t) => {
  const template = 'http://example.com/{type}?brackets=\\{}&page={first}'
  const expected = [
    'http://example.com/',
    {param: 'type'},
    '?brackets={',
    '}&page=',
    {param: 'first'}
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile optional param', (t) => {
  const template = 'http://example.com/{required}/{optional?}'
  const expected = ['http://example.com/', {param: 'required'}, '/', {param: 'optional', optional: true}]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile list of params', (t) => {
  const template = 'http://example.com/{first,max}'
  const expected = ['http://example.com/', [null, {param: 'first'}, {param: 'max'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile query component', (t) => {
  const template = 'http://example.com/{?first,max}'
  const expected = ['http://example.com/', ['?', {param: 'first'}, {param: 'max'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile with specified key', (t) => {
  const template = 'http://example.com/{?page=first,max}'
  const expected = ['http://example.com/', ['?', {param: 'first', key: 'page'}, {param: 'max'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile optional query component', (t) => {
  const template = 'http://example.com/{?first?,max}'
  const expected = ['http://example.com/', ['?', {param: 'first', optional: true}, {param: 'max'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile query continuation', (t) => {
  const template = 'http://example.com/?id=ent1{&first,max}'
  const expected = ['http://example.com/?id=ent1', ['&', {param: 'first'}, {param: 'max'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile path segment', (t) => {
  const template = 'http://example.com{/user,folders}'
  const expected = [
    'http://example.com',
    ['/', {param: 'user', explode: true}, {param: 'folders', explode: true}]
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile fragment expansion', (t) => {
  const template = 'http://example.com/{#anchor}'
  const expected = ['http://example.com/', ['#', {param: 'anchor'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile dot prefix', (t) => {
  const template = 'http://example.com/index{.postfix}'
  const expected = [
    'http://example.com/index',
    ['.', {param: 'postfix', explode: true}]
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile path-style parameter expansion', (t) => {
  const template = '{;list}'
  const expected = [[';', {param: 'list'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile filter function', (t) => {
  const template = 'http://example.com/{folder|append(_archive)}'
  const expected = [
    'http://example.com/',
    {param: 'folder', filters: [{function: append, args: ['_archive']}]}
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile several filter functions', (t) => {
  const template = 'http://example.com/{folder|append(_archive)|prepend(user_)}'
  const expected = [
    'http://example.com/',
    {
      param: 'folder',
      filters: [
        {function: append, args: ['_archive']},
        {function: prepend, args: ['user_']}
      ]
    }
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile filter function with several args', (t) => {
  const template = 'http://example.com{?keys=ids|wrap([, ", ", ])}'
  const expected = [
    'http://example.com',
    [
      '?',
      {param: 'ids', key: 'keys', filters: [{function: wrap, args: ['[', '"', '"', ']']}]}
    ]
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile with escaped comma in args', (t) => {
  const template = 'http://example.com{?keys=ids|wrap([, ", ", \\,"extra"])}'
  const expected = [
    'http://example.com',
    [
      '?',
      {param: 'ids', key: 'keys', filters: [{function: wrap, args: ['[', '"', '"', ',"extra"]']}]}
    ]
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile filter function with no args', (t) => {
  const template = 'http://example.com/{folder|upper()}'
  const expected = [
    'http://example.com/',
    {param: 'folder', filters: [{function: upper}]}
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile filter function with no parens', (t) => {
  const template = 'http://example.com/{folder|upper}'
  const expected = [
    'http://example.com/',
    {param: 'folder', filters: [{function: upper}]}
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile prefix modifier', (t) => {
  const template = 'http://example.com/{section:1}/{section}'
  const expected = [
    'http://example.com/',
    {param: 'section', filters: [{function: max, args: ['1']}]},
    '/',
    {param: 'section'}
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile prefix modifier before filter functions', (t) => {
  const template = 'http://example.com/{section:1|append(_archive)}'
  const expected = [
    'http://example.com/',
    {param: 'section', filters: [{function: max, args: ['1']}, {function: append, args: ['_archive']}]}
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile filter function with equal sign in argument', (t) => {
  const template = 'http://example.com/{type|map(entry=entries)}'
  const expected = [
    'http://example.com/',
    {param: 'type', filters: [{function: map, args: ['entry=entries']}]}
  ]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})
