import test from 'ava'

import {compile, generate} from '..'

test('should generate uri with replacement', (t) => {
  const template = 'http://example.com/{section}{?first,max}'
  const params = {section: 'news', first: 40, max: 20}
  const expected = 'http://example.com/news?first=40&max=20'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  t.is(uri, expected)
})

test('should generate uri with optional parameters', (t) => {
  const template = 'http://example.com/{section}{?first?,max?}'
  const params = {section: 'news', max: 20}
  const expected = 'http://example.com/news?max=20'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  t.is(uri, expected)
})

test('should generate empty string from empty string template', (t) => {
  const template = ''
  const params = {}
  const expected = ''

  const compiled = compile(template)
  const uri = generate(compiled, params)

  t.is(uri, expected)
})

test('should keep escaped curly brackets', (t) => {
  const template = '_design/store/_view/by_type_updatedAt?include_docs=true&startkey=["{type}"]&endkey=["{type}",\\{\\}]'
  const params = {type: 'article'}
  const expected = '_design/store/_view/by_type_updatedAt?include_docs=true&startkey=%5B%22article%22%5D&endkey=%5B%22article%22,%7B%7D%5D'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  t.is(uri, expected)
})
