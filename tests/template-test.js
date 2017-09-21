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

test('should generate uri with filter functions', (t) => {
  const template = 'http://example.com/{section|append(_archive)}{?letter=name|max(1)|lower}'
  const params = {section: 'news', name: 'John F.'}
  const expected = 'http://example.com/news_archive?letter=j'

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
