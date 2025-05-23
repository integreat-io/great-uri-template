import test from 'node:test'
import assert from 'node:assert/strict'

import date from './date.js'

// Tests

test('should format date with provided string', () => {
  const value = new Date('2020-03-18T19:59:03Z')
  const format = 'dd.MM.yyyy'
  const expected = '18.03.2020'

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should format date and time with provided string', () => {
  const value = new Date('2020-03-18T19:59:03Z')
  const format = 'yyyy/MM/dd HH:mm:ss'
  const expected = '2020/03/18 20:59:03'

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should convert to UTC timezone and full ISO format', () => {
  const value = new Date('2020-03-18T19:59:03+01:00')
  const format = 'UTC'
  const expected = '2020-03-18T18:59:03.000Z'

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should convert string value to date', () => {
  const value = '2020-03-18T19:59:03Z'
  const format = 'yyyy/MM/dd HH:mm:ss'
  const expected = '2020/03/18 20:59:03'

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should convert numeric value to date', () => {
  const value = new Date('2020-03-18T19:59:03Z').getTime()
  const format = 'yyyy/MM/dd HH:mm:ss'
  const expected = '2020/03/18 20:59:03'

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should treat date that has lost its inheritance as date', () => {
  const real = new Date('2020-03-18T19:59:03Z')
  const value = {
    getTime: () => real.getTime(),
    toISOString: () => real.toISOString(),
  }
  const format = 'yyyy/MM/dd HH:mm:ss'
  const expected = '2020/03/18 20:59:03'

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should return empty string when value is not date string', () => {
  const value = 'illegal'
  const format = 'yyyy/MM/dd HH:mm:ss'
  const expected = ''

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should return empty string when value is not a date', () => {
  const value = null
  const format = 'yyyy/MM/dd HH:mm:ss'
  const expected = ''

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should return iso string when format is not a string', () => {
  const value = new Date('2020-03-18T19:59:03Z')
  const expected = '2020-03-18T19:59:03.000Z'

  const ret = date(value)

  assert.equal(ret, expected)
})

test('should format date as microseconds since epoc', () => {
  const value = new Date('2020-03-18T19:59:03.113Z')
  const format = 'ms-epoc'
  const expected = '1584561543113'

  const ret = date(value, format)

  assert.equal(ret, expected)
})

test('should format date as seconds since epoc', () => {
  const value = new Date('2020-03-18T19:59:03.113Z')
  const format = 's-epoc'
  const expected = '1584561543'

  const ret = date(value, format)

  assert.equal(ret, expected)
})
