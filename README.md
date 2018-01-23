# console-probe

Inspect JavaScript object methods and properties in the console.

[![bitHound Overall Score][bithound-overall-image]][bithound-overall-url]
[![bitHound Dependencies][bithound-dep-image]][bithound-dep-url]
[![Build Status][travisci-image]][travisci-url]
[![js-standard-style][js-standard-image]][js-standard-url]
[![NSP Status][nsp-image]][nsp-url]
[![Patreon Donation][patreon-image]][patreon-url]

[![NPM][nodei-npm-image]][nodei-npm-url]

Adds a `console.probe()` function to the global `console` object to inspect JavaScript objects. Outputs a tree including the parent objects properties and methods down through the prototype hierarchy.

## Installing

* Node: v4.7.0 or later.
* Browser: Not tested

```sh
npm install --save-dev console-probe
```

## Quick Start

__Not recommended for production environments__

```js

require('./console-probe')

const donut = {
  'id': '0001',
  'type': 'donut',
  'name': 'Cake',
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
  ]
}

console.probe(donut)

```

The above code will produce the following result in the console:

![Example][example-image]

## Rational

Sometimes I am not using Node.js with inspect and just want to console out the methods and properties of an object. I wrote this for those odd times.

## Function

Behind the scenes `console-probe` is adding a function to the console object (monkey patching). This function uses `Object.getOwnPropertyNames()` to enumerate the members of an object. After a little formatting the result is written to the console using the [archy][archy-url] package with some colour added by [chalk][chalk-url].

## API

`console.probe(Object)` will write an inspection of the object to the console.

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
[example-image]: https://cdn.rawgit.com/grantcarthew/node-console-probe/42294bfa/example.png
