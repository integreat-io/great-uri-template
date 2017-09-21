# Integreat URI Template

This template format is loosely based on the
[RFC 6570 standard](https://tools.ietf.org/html/rfc6570), but with some
omissions and some extra features needed for
[Integreat](https://github.com/kjellmorten/integreat).

A main feature is the compilation of the template format to a more runtime
friendly format.

Example of use:
```
const greatUri = require('great-uri-template')

const template = 'http://example.com/{type}/{id}{?first,max}'
const params = {id: 'ent1', type: 'entry', first: 0, max: 20}

const compiled = greatUri.compile(template)
const uri = greatUri.generate(compiled, params)

console.log(uri)
// -> http://example.com/entry/ent1?first=0&max=20
```

## Parameter replacement
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

## Query parameters
Including several parameters in the query string is such a common case, that it
has its own modifier. Prefixing a parameter with a question mark creates a
query component, where several parameters may be included, seperated by a comma.
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

## Other modifiers
RFC 6570 specifies several modifiers like the query component, where a list of
parameters will be expanded to a list with relevant prefix and delimiters.

The following is supported with Integreat URI Template (example with the `var`
parameter as an array of three values):

- Fragment Expansion: `{#var}` -> `#value1,value2,value3`
- Label Expansion: `{.var}` -> `.value1.value2.value3`
- Path Segments Expansion: `{/var}` -> `/value1/value2/value3`
- Path-Style Paramter Expansion: `{;var}` -> `;var=value1,value2,value3`

Note: For Label and Path Segment Expansion, the 'explode' flag is on by default.

## Filter functions
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

## Max length
RFC 6570 specifies a 'prefix modifier', that limits the length of the value, by
suffixing a parameter with a colon and the max number of characters. This is
implemented in Integreat URI Template through the `max` filter function, but the
RFC 6570 syntax is available as a handy shortcut.

Example: With the `section` parameter set to `entertainment`, the template
segment `{section:3}` will expand to `ent`. This is equivalent to
`{section|max(3)}`.