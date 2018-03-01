const cp = require('./index')
const arrLen = 2

const aussieSlang = {
  'name': 'Aussie Slang Words',
  'gday': Infinity,
  'maccas': Number.NaN,
  'arvo': undefined,
  'straya': null,
  'footy': {specky: true},
  'biccy': (size, toppings) => {},
  'servo': true,
  'choccy': Symbol('Mmmmm...'),
  'bottle-o': Error('Cheers mate! My shout next'),
  'tinny': 42,
  'coppa': new Date(),
  'tradie': 'She\'ll be right mate?',
  'postie': /a\long\regexp\that\keeps\giving/,
  'garbo': [1,2,3],
  'muso': new Int8Array(arrLen),
  'cabbie': new Uint8Array(arrLen),
  'ambo': new Uint8ClampedArray(arrLen),
  'prezzie': new Int16Array(arrLen),
  'chrissie': new Uint16Array(arrLen),
  'cuppa': new Int32Array(arrLen),
  'mate': new Uint32Array(arrLen),
  'snag': new Float32Array(arrLen),
  'drongo': new Float64Array(arrLen),
  'fairDinkum': new Map([['foo', 'bar']]),
  'bonza': new Set([['foo', 'bar']]),
  'tooRight': new WeakMap(),
  'dunny': new WeakSet(),
  'cobber': new ArrayBuffer(arrLen),
  'barbie': new SharedArrayBuffer(arrLen),
  'stickybeak': Atomics,
  'stoked': new DataView(new ArrayBuffer(arrLen)),
  'ripper': Promise.resolve(),
  'mongrel': (function * () {})(),
  'holyDooley': function * (foo, bar) {},
  'roo': async function (foo, bar) {}
}
const secret = Symbol('Hidden Property')
aussieSlang[secret] = 'Bogan'

describe('suppressed log tests', () => {
  const spyLog = jest.fn()
  const consoleLog = console.log

  beforeAll(() => {
    console.log = spyLog
  })

  test('console-probe functions called by console object', () => {
    expect(() => console.probe()).toThrow()
    expect(() => console.json()).toThrow()
    expect(() => console.yaml()).toThrow()
    cp.apply()
    console.probe(aussieSlang)
    expect(spyLog).toHaveBeenCalledTimes(1)
    console.json(aussieSlang)
    expect(spyLog).toHaveBeenCalledTimes(2)
    console.yaml(aussieSlang)
    expect(spyLog).toHaveBeenCalledTimes(3)
  })

  test('console-probe functions appended to another object', () => {
    const thing = {}
    expect(() => thing.probe()).toThrow()
    expect(() => thing.json()).toThrow()
    expect(() => thing.yaml()).toThrow()
    cp.apply(thing)
    const probeSpy = jest.spyOn(thing, 'probe')
    thing.probe(aussieSlang)
    expect(probeSpy).toHaveBeenCalledTimes(1)
    const jsonSpy = jest.spyOn(thing, 'json')
    thing.json(aussieSlang)
    expect(jsonSpy).toHaveBeenCalledTimes(1)
    const yamlSpy = jest.spyOn(thing, 'yaml')
    thing.yaml(aussieSlang)
    expect(yamlSpy).toHaveBeenCalledTimes(1)
  })

  test('console-probe stand-alone functions', () => {
    expect(typeof cp.probe).toBe('function')
    expect(cp.probe).toBe(console.probe)
    expect(cp.probe.toString()).toBe(console.probe.toString())
    expect(typeof cp.json).toBe('function')
    expect(cp.json).toBe(console.json)
    expect(cp.json.toString()).toBe(console.json.toString())
    expect(typeof cp.yaml).toBe('function')
    expect(cp.yaml).toBe(console.yaml)
    expect(cp.yaml.toString()).toBe(console.yaml.toString())
  })

  test('console-probe type support', () => {
    expect(() => { cp.probe() }).not.toThrow()
    expect(() => { cp.probe(Infinity) }).not.toThrow()
    expect(() => { cp.probe(Number.NaN) }).not.toThrow()
    expect(() => { cp.probe(undefined) }).not.toThrow()
    expect(() => { cp.probe(null) }).not.toThrow()
    expect(() => { cp.probe({}) }).not.toThrow()
    expect(() => { cp.probe(function name () {}) }).not.toThrow()
    expect(() => { cp.probe(() => {}) }).not.toThrow()
    expect(() => { cp.probe(true) }).not.toThrow()
    expect(() => { cp.probe(Symbol('test')) }).not.toThrow()
    expect(() => { cp.probe(new Error('test')) }).not.toThrow()
    expect(() => { cp.probe(1) }).not.toThrow()
    expect(() => { cp.probe(-1) }).not.toThrow()
    expect(() => { cp.probe(0) }).not.toThrow()
    expect(() => { cp.probe(new Date()) }).not.toThrow()
    expect(() => { cp.probe('') }).not.toThrow()
    expect(() => { cp.probe(/a/) }).not.toThrow()
    expect(() => { cp.probe([]) }).not.toThrow()
    expect(() => { cp.probe(new Int8Array()) }).not.toThrow()
    expect(() => { cp.probe(new Uint8Array()) }).not.toThrow()
    expect(() => { cp.probe(new Uint8ClampedArray()) }).not.toThrow()
    expect(() => { cp.probe(new Int16Array()) }).not.toThrow()
    expect(() => { cp.probe(new Uint16Array()) }).not.toThrow()
    expect(() => { cp.probe(new Int32Array()) }).not.toThrow()
    expect(() => { cp.probe(new Uint32Array()) }).not.toThrow()
    expect(() => { cp.probe(new Float32Array()) }).not.toThrow()
    expect(() => { cp.probe(new Float64Array()) }).not.toThrow()
    expect(() => { cp.probe(new Map()) }).not.toThrow()
    expect(() => { cp.probe(new Set()) }).not.toThrow()
    expect(() => { cp.probe(new WeakMap()) }).not.toThrow()
    expect(() => { cp.probe(new WeakSet()) }).not.toThrow()
    expect(() => { cp.probe(new ArrayBuffer()) }).not.toThrow()
    expect(() => { cp.probe(new SharedArrayBuffer()) }).not.toThrow()
    expect(() => { cp.probe(Atomics) }).not.toThrow()
    expect(() => { cp.probe(new DataView(new ArrayBuffer)) }).not.toThrow()
    expect(() => { cp.probe(Promise.resolve()) }).not.toThrow()
    expect(() => { cp.probe((function * () {})()) }).not.toThrow()
    expect(() => { cp.probe(function * () {}) }).not.toThrow()
    expect(() => { cp.probe(async function () {}) }).not.toThrow()
    expect(() => { cp.probe(cp) }).not.toThrow()
    expect(spyLog).toHaveBeenCalledTimes(46)
  })

  afterAll(() => {
    console.log = consoleLog
  })
})

afterAll(() => {
  console.log()
  cp.yaml(aussieSlang)
  cp.json(aussieSlang)
  cp.probe(aussieSlang)
  console.log()
})
