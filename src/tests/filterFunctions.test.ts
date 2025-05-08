import test from 'node:test'
import assert from 'node:assert'

import compile from '../compile.js'
import generate from '../generate.js'

// Tests

test('should generate uri with filter functions', () => {
  const template =
    'http://example.com/{section|append(_archive)}{?letter=name|max(1)|lower}'
  const params = { section: 'news', name: 'John F.' }
  const expected = 'http://example.com/news_archive?letter=j'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  assert.equal(uri, expected)
})

test('should generate uri with escaped characters in filter args', () => {
  const template = 'http://example.com/{?keys=ids|wrap([, ", ", \\,\\{\\}])}'
  const params = { ids: ['ent1', 'ent5'] }
  const expected =
    'http://example.com/?keys=%5B%22ent1%22%2C%22ent5%22%2C%7B%7D%5D'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  assert.equal(uri, expected)
})

test('should generate uri with date filter functions', () => {
  const template =
    'http://example.com/all{?since=updatedAfter|date(dd/MM/yyyy HH:mm:ss)?,until=updatedBefore|date(yyyy-MM-dd)?}'
  const params = {
    updatedAfter: new Date('2020-03-20T18:43:11Z'),
    updatedBefore: new Date('2020-03-22T21:00:00Z'),
  }
  const expected =
    'http://example.com/all?since=20%2F03%2F2020%2019%3A43%3A11&until=2020-03-22'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  assert.equal(uri, expected)
})

test('should generate uri with date as seconds since epoc', () => {
  const template =
    'http://example.com/all{?since=updatedAfter|date(s-epoc)?,until=updatedBefore|date(YYYY-MM-DD)?}'
  const params = {
    updatedAfter: new Date('2020-03-20T18:43:11.875Z'),
  }
  const expected = 'http://example.com/all?since=1584729792'

  const compiled = compile(template)
  const uri = generate(compiled, params)

  assert.equal(uri, expected)
})
