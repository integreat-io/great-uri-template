import test from 'ava'

import date from './date'

// Tests

test('should format date with provided string', (t) => {
  const value = new Date('2020-03-18T19:59:03Z')
  const format = 'DD.MM.YYYY'
  const expected = '18.03.2020'

  const ret = date(value, format)

  t.is(ret, expected)
})

test('should format date and time with provided string', (t) => {
  const value = new Date('2020-03-18T19:59:03Z')
  const format = 'YYYY/MM/DD HH:mm:ss'
  const expected = '2020/03/18 20:59:03'

  const ret = date(value, format)

  t.is(ret, expected)
})

test('should convert string value to date', (t) => {
  const value = '2020-03-18T19:59:03Z'
  const format = 'YYYY/MM/DD HH:mm:ss'
  const expected = '2020/03/18 20:59:03'

  const ret = date(value, format)

  t.is(ret, expected)
})

test('should convert numeric value to date', (t) => {
  const value = (new Date('2020-03-18T19:59:03Z')).getTime()
  const format = 'YYYY/MM/DD HH:mm:ss'
  const expected = '2020/03/18 20:59:03'

  const ret = date(value, format)

  t.is(ret, expected)
})

test('should treat date that has lost its inheritance as date', (t) => {
  const real = new Date('2020-03-18T19:59:03Z')
  const value = {
    getTime: () => real.getTime(),
    toISOString: () => real.toISOString()
  }
  const format = 'YYYY/MM/DD HH:mm:ss'
  const expected = '2020/03/18 20:59:03'

  const ret = date(value, format)

  t.is(ret, expected)
})

test('should return empty string when value is not date string', (t) => {
  const value = 'illegal'
  const format = 'YYYY/MM/DD HH:mm:ss'
  const expected = ''

  const ret = date(value, format)

  t.is(ret, expected)
})

test('should return empty string when value is not a date', (t) => {
  const value = null
  const format = 'YYYY/MM/DD HH:mm:ss'
  const expected = ''

  const ret = date(value, format)

  t.is(ret, expected)
})

test('should return iso string when format is not a string', (t) => {
  const value = new Date('2020-03-18T19:59:03Z')
  const expected = '2020-03-18T19:59:03.000Z'

  const ret = date(value)

  t.is(ret, expected)
})
