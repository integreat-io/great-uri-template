# Integreat URI Template

Template format loosely based on the
[RFC 6570 standard](https://tools.ietf.org/html/rfc6570), with some
omissions and some extra features needed for
[Integreat](https://github.com/integreat-io/integreat). A main feature is the
compilation of the string-based template format to a more runtime friendly
format.

> [!NOTE]
> This package will not be developed any further, but is kept as it is still in
> use. We update dependencies etc. from time to time, but have no plans beyond
> that.

## Getting started

### Prerequisits

Requires node v22.

### Installing

Install from npm:

```
npm install great-uri-template
```

Example of use:

```
import greatUri from 'great-uri-template'

const template = 'http://example.com/{type}/{id}{?first,max}'
const params = {id: 'ent1', type: 'entry', first: 0, max: 20}

const compiled = greatUri.compile(template)
const uri = greatUri.generate(compiled, params)

console.log(uri)
//--> http://example.com/entry/ent1?first=0&max=20
```

### Running the tests

The tests can be run with `npm test`.

## The template format

### Parameter replacement

The simplest template features parameter replacements. Parameters are indicated
in the template by putting parameter names in curly brackets: `{id}`.

Example: `http://example.com/{type}/{id}`

Several parameters may be included within the brackets, seperated by commas. The
values of these parameters will be expanded in the order they are specified,
also seperated by commas. E.g.: `http://example.com/{first,second,third}`.

Parameters are required by default, but may be made optional by suffixing them
with a question mark. Here, the `id` parameter is optional:
`http://example.com/{type}/{id?}`. Optional params without a value will simply
be excluded from the resulting uri. With the `type` parameter set to `entry` and
an undefined `id` parameter, this template would expand to the uri
`http://example.com/entry/`.

To include curly brackets in the url, without replacement, simply escape them:
`?brackets=\\{\\}`. (Remember double escape characters to escape the
escape character in JavaScript.)

### Query parameters

Including several parameters in the query string is such a common case, that it
has its own modifier. Prefixing a parameter with a question mark creates a
query component, where several parameters may be included, separated by a comma.
A query component will be expanded to a key-value list, prefixed by a question
mark, and delimited by ampersands.

The template `http://example.com{?first,max}`, given the param object
`{first: 0, max: 20}`, will generate the uri
`http://example.com?first=0&max=20`.

Here, the parameter name is used as key, but a different key name may be
specified like so: `http://example.com{?page=first}`, which will generate the
uri `http://example.com?page=0`.

When the query string question mark is already specified in a template, the
query continuation component should be used, to avoid a second question mark.
The template `http://example.com?section=archive{&first,max}` will expand to the
uri `http://example.com?section=archive&first=0&max=20`.

### Other modifiers

RFC 6570 specifies several modifiers like the query component, where a list of
parameters will be expanded to a list with relevant prefix and delimiters.

The following is supported with Integreat URI Template (example with the `var`
parameter as an array of three values):

- Fragment Expansion: `{#var}` -> `#value1,value2,value3`
- Label Expansion: `{.var}` -> `.value1.value2.value3`
- Path Segments Expansion: `{/var}` -> `/value1/value2/value3`
- Path-Style Paramter Expansion: `{;var}` -> `;var=value1,value2,value3`
- Reserved Expansion: `{+var}` -> `value1,value2,value3`

For Label and Path Segment Expansion, the 'explode' flag is on by default.

When expanding parameters, all uri reserved characters are encoded, except for
Fragment and Reserved expansion. With a parameter `path` set to
`sections/news`, the template `http://example.com/{path}` will result
in the uri `http://example.com/sections%2Fnews`. So to expand `path` as
an actual path, use the template `http://example.com/{+path}`, which will
expand to `http://example.com/sections/news`. See [Variable Expansion](https://tools.ietf.org/html/rfc6570#section-3.2.1) in RFC 6570 for
more on encoding.

### Filter functions

Functions may be added to a parameter after a pipe character, to filter or
modify the parameter value before it is expanded in the uri. This is an
extension to RFC 6570.

E.g., with the `section` parameter set to `news`, the template segment
`{section|append(_archive)}` will expand to `news_archive`, as the filter
function `append` appends the string within the parentheses to the parameter
value. If this was an optional parameter and the value was empty, nothing would
be appended.

Several functions may be chained, where the result of the first is given as the
value for the next, etc.

For filter functions without arguments, parentheses are optional.

#### `append(string)`

Append the given string to the value. Will not touch null values or empty
strings.

Example:

```
const params = {section: 'news'}
const template = 'http://example.com/{section|append(_archive)}'
...
//--> http://example.com/news_archive
```

#### `prepend(string)`

Prepend the given string to the value. Will not touch null values or empty
strings.

Example:

```
const params = {section: 'news'}
const template = 'http://example.com/{section|prepend(local_)}'
...
//--> http://example.com/local_news
```

#### `date(format)`

Formats a date according to the given date format string.

Uses `luxon` under the hood, so refer to
[their documentation](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).

In addition, three custom formats are available:

- `ms-epoc`: The number of microseconds since 1970-01-01.
- `s-epoc`. The number of seconds since 1970-01-01, rounded to the nearest
  second.
- `UTC`: The date and time in UTC time zone and the full ISO format, like
  `'2025-05-08T14:26:31.000Z'`.

”Example:

```
const params = {updatedAfter: new Date('2020-03-19T14:08:44Z')}
const template = 'http://example.com/all{?updatedAfter|date(DD/MM/YYYY HH:mm:ss)}'
...
//--> http://example.com/all?updatedAfter=20%2F03%2F2020%2019%3A43%3A11
```

#### `lower()`

Transform the given value to lower case.

Example:

```
const params = {section: 'News'}
const template = 'http://example.com/{section|lower}'
...
//--> http://example.com/news
```

#### `upper()`

Transform the given value to upper case.

Example:

```
const params = {section: 'News'}
const template = 'http://example.com/{?section|upper}'
...
//--> http://example.com/?section=NEWS
```

#### `max(length)`

Cut the value to a string of the given length. If length is higher than the
number of characters in value, value is left untouched.

Example:

```
const params = {section: 'entertainment'}
const template = 'http://example.com/{section|max(3)}'
...
//--> http://example.com/ent
```

#### `wrap(outerLeft, [innerLeft, innerRight,] outerRight)`

Wrap the value in the given strings.

The value is wrapped in `outerLeft` and `outerRight`. If the value is an array,
it is joined with commas, before it is wrapped.

If `innerLeft` and `innerRight` is specified, each element in array will be
wrapped in these, before the entire list is wrapped in `outerLeft` and
`outerRight`. A non-array value is wrapped in all four the same way an array
with one element would.

Example:

```
const params = {section: 'news', ids=['ent1', 'ent2', ent5]}
const template = 'http://example.com/{section|wrap(_, _)}{?ids|wrap([, ", ", ])}'
...
//--> http://example.com/_news_/?ids=["ent1", "ent2", "ent5"]
```

#### `map(from=to[, from=to[, ...]])`

Will map the given value to a replacement according to the `from=to` pairs
given as arguments to the `map` function. If no match is found, the value is
not replaced.

```
const params = {type: 'entry'}
const template = 'http://example.com/{type|map(article=articles, entry=entries)}'
...
//--> http://example.com/entries
```

### Max length

RFC 6570 specifies a 'prefix modifier', that limits the length of the value, by
suffixing a parameter with a colon and the max number of characters. This is
implemented in Integreat URI Template through the `max` filter function, but the
RFC 6570 syntax is available as a handy shortcut.

Example: With the `section` parameter set to `entertainment`, the template
segment `{section:3}` will expand to `ent`. This is equivalent to
`{section|max(3)}`.

## Contributing

Please read
[CONTRIBUTING](https://github.com/integreat-io/great-uri-template/blob/master/CONTRIBUTING.md)
for details on our code of conduct, and the process for submitting pull
requests.

## License

This project is licensed under the ISC License - see the
[LICENSE](https://github.com/integreat-io/great-uri-template/blob/master/LICENSE)
file for details.
