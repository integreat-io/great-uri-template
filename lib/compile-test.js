import test from 'ava'

import compile from './compile'

test('should exist', (t) => {
  t.is(typeof compile, 'function')
})

test('should compile parameter replacement', (t) => {
  const template = 'http://example.com/{type}:{id}'
  const expected = ['http://example.com/', {param: 'type'}, ':', {param: 'id'}]

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
  const expected = ['http://example.com', ['/', {param: 'user'}, {param: 'folders'}]]

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
  const expected = ['http://example.com/index', ['.', {param: 'postfix'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})

test('should compile path-style parameter expansion', (t) => {
  const template = '{;list}'
  const expected = [[';', {param: 'list'}]]

  const ret = compile(template)

  t.deepEqual(ret, expected)
})
