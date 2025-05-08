import type { FilterValue } from '../types.js'

/**
 * Wrap the value with the strings provided in args.
 * If the value is an array, two parts will wrap the entire result, while four
 * parts will also wrap each element. With four parts and no array, the value
 * will be wrapped as an array with one element.
 * @param {string} value - The value to wrap
 * @param {string[]} parts - Array of strings of the format `[outer_left, [inner_left, inner_right,] outer_right]`
 * @returns {string} The wrapped value
 */
export default function wrap(
  value: FilterValue,
  ...parts: string[]
): FilterValue {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    parts.length < 2
  ) {
    return value
  }

  if (parts.length >= 4) {
    const arr = Array.isArray(value) ? value : [value]
    return parts[0] + arr.map((val) => parts[1] + val + parts[2]) + parts[3]
  }

  return parts[0] + value + parts[1]
}
