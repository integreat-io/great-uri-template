import test from 'ava'

import generate from './generate'

test('should exist', (t) => {
  t.is(typeof generate, 'function')
})

test('should generate with simple parameter replacement', (t) => {
  const compiled = ['http://example.com/', {param: 'type'}, ':', {param: 'id'}]
  const params = {id: 'ent1', type: 'entry'}
  const expected = 'http://example.com/entry:ent1'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate with optional parameter', (t) => {
  const compiled = ['http://example.com/', {param: 'type'}, '/', {param: 'id', optional: true}]
  const params = {type: 'entry'}
  const expected = 'http://example.com/entry/'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should throw when missing required parameter', (t) => {
  const compiled = ['http://example.com/', {param: 'type'}, '/', {param: 'id'}]
  const params = {type: 'entry'}

  t.throws(() => {
    generate(compiled, params)
  })
})

test('should generate from list of parameters', (t) => {
  const compiled = ['http://example.com/', [null, {param: 'first'}, {param: 'second'}]]
  const params = {first: 1, second: 2}
  const expected = 'http://example.com/1,2'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate query component', (t) => {
  const compiled = ['http://example.com/', ['?', {param: 'first'}, {param: 'max'}]]
  const params = {first: 0, max: 20}
  const expected = 'http://example.com/?first=0&max=20'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate with specific key', (t) => {
  const compiled = ['http://example.com/', ['?', {param: 'first', key: 'page'}, {param: 'max'}]]
  const params = {first: 0, max: 20}
  const expected = 'http://example.com/?page=0&max=20'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate optional query component', (t) => {
  const compiled = ['http://example.com/', ['?', {param: 'first', optional: true}, {param: 'max'}]]
  const params = {max: 20}
  const expected = 'http://example.com/?max=20'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate query component with array', (t) => {
  const compiled = ['http://example.com/', ['?', {param: 'ids'}]]
  const params = {ids: ['ent1', 'ent2', 'ent5']}
  const expected = 'http://example.com/?ids=ent1,ent2,ent5'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate query continuation', (t) => {
  const compiled = ['http://example.com/?id=ent1', ['&', {param: 'first'}, {param: 'max'}]]
  const params = {first: 0, max: 20}
  const expected = 'http://example.com/?id=ent1&first=0&max=20'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate path segment', (t) => {
  const compiled = ['http://example.com', ['/', {param: 'user'}, {param: 'folders'}]]
  const params = {user: 'johnf', folders: ['home', 'pictures']}
  const expected = 'http://example.com/johnf/home/pictures'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate fragment expansion', (t) => {
  const compiled = ['http://example.com/', ['#', {param: 'anchor'}]]
  const params = {anchor: 'header'}
  const expected = 'http://example.com/#header'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate fragment expansion with array', (t) => {
  const compiled = ['http://example.com/', ['#', {param: 'anchor'}]]
  const params = {anchor: ['header', 'one']}
  const expected = 'http://example.com/#header,one'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate dot prefix', (t) => {
  const compiled = ['http://example.com/index', ['.', {param: 'postfix'}]]
  const params = {postfix: ['old', 'html']}
  const expected = 'http://example.com/index.old.html'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate path-style parameter expansion', (t) => {
  const compiled = [[';', {param: 'first'}, {param: 'second'}]]
  const params = {first: 1, second: 2}
  const expected = ';first=1;second=2'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate path-style parameter expansion with array', (t) => {
  const compiled = [[';', {param: 'first'}]]
  const params = {first: [1, 2]}
  const expected = ';first=1,2'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})