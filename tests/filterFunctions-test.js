import test from 'ava'

import {compile, generate} from '..'

test('should generate uri with filter functions', (t) => {
  const template = 'http://example.com/{section|append(_archive)}{?letter=name|max(1)|lower}'
  const params = {section: 'news', name: 'John F.'}
  const expected = 'http://example.com/news_archive?letter=j'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  t.is(uri, expected)
})

test('should generate uri with escaped characters in filter args', (t) => {
  const template = 'http://example.com/{?keys=ids|wrap([, ", ", \\,\\{\\}])}'
  const params = {ids: ['ent1', 'ent5']}
  const expected = 'http://example.com/?keys=%5B%22ent1%22,%22ent5%22,%7B%7D%5D'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  t.is(uri, expected)
})
