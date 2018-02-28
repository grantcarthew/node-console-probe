# console-probe

Inspect JavaScript object methods and properties in the console.

[![bitHound Overall Score][bithound-overall-image]][bithound-overall-url]
[![bitHound Dependencies][bithound-dep-image]][bithound-dep-url]
[![Build Status][travisci-image]][travisci-url]
[![js-standard-style][js-standard-image]][js-standard-url]
[![NSP Status][nsp-image]][nsp-url]
[![Patreon Donation][patreon-image]][patreon-url]

[![NPM][nodei-npm-image]][nodei-npm-url]

Provides colourful functions to inspect JavaScript objects.

* The `probe()` function outputs a prototype hierarchy tree to the console.
* The `json()` function safely writes a stringified object output to the console.
* The `yaml()` function converts objects into yaml format and outputs to the console.

## Installing

* Node: v4.7.0 or later.
* Browser: Not tested

```sh
npm install --save-dev console-probe
```

## Quick Start

__Not recommended for production environments__


```js

const cp = require('./console-probe')

const donut = {
  'id': '0001',
  'type': 'donut',
  'name': 'Cake',
  'description': 'A small fried cake of sweetened dough, typically in the shape of a ball or ring.',
  'ppu': 0.55,
  'common': true,
  'batters':
  {
    'batter':
    [
      { 'id': '1001', 'type': 'Regular' },
      { 'id': '1002', 'type': 'Chocolate' },
      { 'id': '1003', 'type': 'Blueberry' },
      { 'id': '1004', 'type': "Devil's Food" }
    ]
  },
  'topping':
  [
    { 'id': '5001', 'type': 'None' },
    { 'id': '5002', 'type': 'Glazed' },
    { 'id': '5005', 'type': 'Sugar' },
    { 'id': '5007', 'type': 'Powdered Sugar' },
    { 'id': '5006', 'type': 'Chocolate with Sprinkles' },
    { 'id': '5003', 'type': 'Chocolate' },
    { 'id': '5004', 'type': 'Maple' }
  ],
  'addToCart': function addToCart (id, quantity) {},
  'removeFromCart': (id, quantity) => {},
  'holeContents': null
}

// Calling console-probe functions.
cp.probe(donut) // Writes prototype tree to the console
cp.json(donut) // Writes a JSON formatted object to the console
cp.yaml(donut) // Writes YAML formatted object to the console

// Adding console-probe functions to the console.
console.probe(donut) // Throws exception 'console.probe is not a function'
console.json(donut) // Throws exception 'console.json is not a function'
console.yaml(donut) // Throws exception 'console.yaml is not a function'
cp.apply()
console.probe(donut) // Writes prototype tree to the console
console.json(donut) // Writes a JSON formatted object to the console
console.yaml(donut) // Writes a YAML formatted object to the console

// Adding console-probe functions to an object.
const foo = {}
cp.apply(foo)
foo.probe(donut) // Writes prototype tree to the console
foo.json(donut) // Writes a JSON formatted object to the console
foo.yaml(donut) // Writes a YAML formatted object to the console

```

The above code will produce the following results when it writes to the console.

### The `probe` function output:

_Note: Types of `null`, `undefined`, or type conversion errors will display as `[---]`._

![Example Probe Output][example-probe-image]

### The `json` function output:

![Example Json Output][example-json-image]

### The `yaml` function output:

![Example Yaml Output][example-yaml-image]

## Rational

There are many amazing packages on `npm`. Many of those packages are not well documented. Rather than go straight to reading source code I wrote `console-probe` to inspect objects and discover methods and properties. Using Node.js with inspect is often a better approach however I don't always have it running; this is when `console-probe` comes in handy.

## Function

The `console-probe` package provides three functions that will write to the console:

* `probe(obj)`: The probe function uses `Object.getOwnPropertyNames()` to enumerate the members of an object through its prototype hierarchy. After a little formatting the result is written to the console using the [archy][archy-url] package with some colour added by [chalk][chalk-url].
* `json(obj, replacer, spacer, color)`: Uses [fast-safe-stringify][fss-url] and [json-colorizer][json-colorizer-url] to safely write the stringified object out to the console.
* `yaml(obj, options, indentation)`: A simple wrapper around the [prettyjson][prettyjson-url] package render function.

## API

### `probe` Function

__Description:__ Inspects the passed objects properties and methods, then the prototype of the passed object, and so on till the last prototype is analyzed. A tree of the properties and methods on each prototype is written to the console.

__Method Signature:__ `probe(object)`

__Parameter:__ `object` can be any JavaScript type.

__Details:__

* Passing either `null` or `undefined` will write null or undefined to the console.
* String values with newline characters are stripped from string stubs.

__Example:__

```js
const cp = require('console-probe')
cp.probe({ key: 'value' })
// Writes the object prototype hierarchy to the console
// See above for an example of the output
```

### `json` Function

__Description:__ This function simply calls [fast-safe-stringify][fss-url] and then adds color via [json-colorizer][json-colorizer-url]. Once that is done it writes the result to the console.

__Method Signature:__ `json(object, replacer, spacer, color)`

__Parameter:__

* `object` can be any object you wish to stringify.
* `replacer` alters the behavior of the stringification process.
* `spacer` inserts white space into the output JSON string for readability purposes.
* `color` enables customization of the colour displayed.

__Details:__

* The `json` function defaults to `replacer = null` and `spacer = 2`.
* See both [fast-safe-stringify][fss-url] and [JSON.stringify][json-stringify-url] for more details.
* Change the color displayed using a color object from the [json-colorizer][json-colorizer-url] options.

__Example:__

```js
const cp = require('console-probe')
cp.json({ key: 'value' })
// Outputs the following to the console:
//{
//  "key": "value"
//}
```

### `yaml` Function

__Description:__ This function wraps the [prettyjson][prettyjson-url] render function and writes the result to the console. The result is a colorized formatted [YAML][yaml-url] representation of the object data.

__Signature:__ `yaml(object, options, indentation)`

__Parameter:__

* `object` can be any object you wish to display in [YAML][yaml-url] format.
* `options` should hold options for the [prettyjson][prettyjson-url] render function.
* `indentation` controls the indentation for the YAML output.

__Details:__

* The `yaml` function is simply a wrapper around the [prettyjson][prettyjson-url] package.
* See the [prettyjson][prettyjson-url] documentation and code for the options and indentation.

__Example:__

```js
const cp = require('console-probe')
cp.yaml({ key: 'value' })
// Outputs the following to the console:
// key: value
```

### `apply` Function

__Signature:__ `apply(object)`

__Parameter:__ `object` can be any object you would like to add `console-probe` functions to.

__Details:__

* The `apply` function is a convenience method to add the `console-probe` functions to an object.
* If no `object` is passed to the `apply` function then the `console-probe` functions will be added to the `console` object.
* Passing an object, such as a logger, will add the `console-probe` functions to the object.

__Example:__

```js
const cp = require('console-probe')
cp.apply()
// console now has a probe, json, and yaml function.

const foo = {}
cp.apply(foo)
// foo now has a probe, json, and yaml function.
```

Another approach to simply augment the console:

```js
require('console-probe').apply()
// console.probe, console.json, and console.yaml are now ready for use.
```

## About the Owner

I, Grant Carthew, am a technologist, trainer, and Dad from Queensland, Australia. I work on code in a number of personal projects and when the need arises I build my own packages.

This project exists because I wanted to inspect objects from the console.

Everything I do in open source is done in my own time and as a contribution to the open source community.

If you are using my projects and would like to thank me or support me, please click the Patreon link below.

[![Patreon Donation][patreon-image]][patreon-url]

See my [other projects on NPM](https://www.npmjs.com/~grantcarthew).

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Change Log
- v4.0.0 [Not Yet Published]
  - Added multiple type support.
  - Strings extended from 10 to 15 characters.
- v3.1.0 [2018-02-19]: Added colour to json. Added yaml function.
- v3.0.0 [2018-02-18]: Added json function. Improved API. Removed newline chrs.
- v2.0.4 [2018-01-29]: Changed node label format.
- v2.0.3 [2018-01-26]: Fix example image url.
- v2.0.2 [2018-01-26]: Added support for arrays and values. Fixed sort.
- v2.0.1 [2018-01-25]: Added repository url to package.json.
- v2.0.0 [2018-01-24]: Changed API. Improved type support.
- v1.0.2 [2018-01-23]: Updated Readme.
- v1.0.1 [2018-01-23]: Updated NSP link.
- v1.0.0 [2018-01-23]: Initial release. 

[bithound-overall-image]: https://www.bithound.io/github/grantcarthew/node-console-probe/badges/score.svg
[bithound-overall-url]: https://www.bithound.io/github/grantcarthew/node-console-probe
[bithound-dep-image]: https://www.bithound.io/github/grantcarthew/node-console-probe/badges/dependencies.svg
[bithound-dep-url]: https://www.bithound.io/github/grantcarthew/node-console-probe/master/dependencies/npm
[travisci-image]: https://travis-ci.org/grantcarthew/node-console-probe.svg?branch=master
[travisci-url]: https://travis-ci.org/grantcarthew/node-console-probe
[js-standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[js-standard-url]: http://standardjs.com/
[mppg-url]: https://github.com/grantcarthew/node-console-probe
[bithound-code-image]: https://www.bithound.io/github/grantcarthew/node-console-probe/badges/code.svg
[bithound-code-url]: https://www.bithound.io/github/grantcarthew/node-console-probe
[nsp-image]: https://nodesecurity.io/orgs/openjs/projects/8559f978-a8a7-4f6a-afdc-49bb319ad947/badge
[nsp-url]: https://nodesecurity.io/orgs/openjs/projects/8559f978-a8a7-4f6a-afdc-49bb319ad947
[patreon-image]: https://img.shields.io/badge/patreon-donate-yellow.svg
[patreon-url]: https://www.patreon.com/grantcarthew
[nodei-npm-image]: https://nodei.co/npm/console-probe.png?downloads=true&downloadRank=true&stars=true
[nodei-npm-url]: https://nodei.co/npm/console-probe/
[archy-url]: https://www.npmjs.com/package/archy
[chalk-url]: https://www.npmjs.com/package/chalk
[fss-url]: https://www.npmjs.com/package/fast-safe-stringify
[example-probe-image]: https://cdn.rawgit.com/grantcarthew/node-console-probe/77a6726d/example-probe.png
[example-json-image]: https://cdn.rawgit.com/grantcarthew/node-console-probe/77a6726d/example-json.png
[example-yaml-image]: https://cdn.rawgit.com/grantcarthew/node-console-probe/77a6726d/example-yaml.png
[json-stringify-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[prettyjson-url]: https://www.npmjs.com/package/prettyjson
[json-colorizer-url]: https://www.npmjs.com/package/json-colorizer
[yaml-url]: http://yaml.org/
