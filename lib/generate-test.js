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

test('should not throw when no parameters', (t) => {
  const compiled = ['http://example.com/', {param: 'id', optional: true}]
  const expected = 'http://example.com/'

  const ret = generate(compiled)

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
  const compiled = [
    'http://example.com',
    ['/', {param: 'user', explode: true}, {param: 'folders', explode: true}]
  ]
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
  const compiled = [
    'http://example.com/index',
    ['.', {param: 'postfix', explode: true}]
  ]
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

test('should generate with filter function', (t) => {
  const append = (value, string) => value + string
  const compiled = [
    'http://example.com/',
    {param: 'section', filters: [{function: append, args: ['_archive']}]}
  ]
  const params = {section: 'news'}
  const expected = 'http://example.com/news_archive'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate with several filter functions', (t) => {
  const max = (value, length) => value.substring(0, length)
  const append = (value, string) => value + string
  const compiled = [
    'http://example.com/',
    {param: 'section', filters: [{function: max, args: ['3']}, {function: append, args: ['_archive']}]}
  ]
  const params = {section: 'news'}
  const expected = 'http://example.com/new_archive'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should generate with filter function and no arguments', (t) => {
  const lower = (value) => value.toLowerCase()
  const compiled = [
    'http://example.com/',
    {param: 'section', filters: [{function: lower}]}
  ]
  const params = {section: 'News'}
  const expected = 'http://example.com/news'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should skip filters without function', (t) => {
  const append = (value, string) => value + string
  const compiled = [
    'http://example.com/',
    {param: 'section', filters: [{function: 'illegal'}, {function: append, args: ['_archive']}]}
  ]
  const params = {section: 'news'}
  const expected = 'http://example.com/news_archive'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})

test('should uri encode', (t) => {
  const compiled = [
    'http://example.com/',
    {param: 'type'},
    ' ',
    {param: 'id'},
    ['?', {param: 'texts'}],
    '#main_content'
  ]
  const params = {
    id: 'ent1',
    type: 'entry',
    texts: ['Første test', 'Andre tekst']
  }
  const expected = 'http://example.com/entry%20ent1?texts=F%C3%B8rste%20test,Andre%20tekst#main_content'

  const ret = generate(compiled, params)

  t.is(ret, expected)
})
