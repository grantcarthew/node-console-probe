const consoleProbe = require('./index')

const donut = {
  'id': '0001',
  'type': 'donut',
  'name': 'Cake',
  'description': 'A small \nfried cake of sweetened dough, typically in the shape of a ball or ring.',
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

describe('suppressed log tests', () => {
  const spyLog = jest.fn()
  const consoleLog = console.log

  beforeAll(() => {
    console.log = spyLog
  })

  test('console-probe called by console.probe', () => {
    expect(() => console.probe()).toThrow()
    expect(() => console.json()).toThrow()
    consoleProbe.apply()
    console.probe(donut)
    expect(spyLog).toHaveBeenCalledTimes(1)
    console.json(donut)
    expect(spyLog).toHaveBeenCalledTimes(2)
  })

  test('console-probe appended to another object', () => {
    const thing = {}
    expect(() => thing.probe()).toThrow()
    expect(() => thing.json()).toThrow()
    consoleProbe.apply(thing)
    const probeSpy = jest.spyOn(thing, 'probe')
    thing.probe(donut)
    expect(probeSpy).toHaveBeenCalledTimes(1)
    const jsonSpy = jest.spyOn(thing, 'json')
    thing.json(donut)
    expect(jsonSpy).toHaveBeenCalledTimes(1)
  })

  test('console-probe stand-alone functions', () => {
    expect(typeof consoleProbe.probe).toBe('function')
    expect(consoleProbe.probe).toBe(console.probe)
    expect(consoleProbe.probe.toString()).toBe(console.probe.toString())
    expect(typeof consoleProbe.json).toBe('function')
    expect(consoleProbe.json).toBe(console.json)
    expect(consoleProbe.json.toString()).toBe(console.json.toString())
  })

  test('console-probe type support', () => {
    expect(() => { consoleProbe.probe() }).not.toThrow()
    expect(() => { consoleProbe.probe(null) }).not.toThrow()
    expect(() => { consoleProbe.probe(undefined) }).not.toThrow()
    expect(() => { consoleProbe.probe(function name () {}) }).not.toThrow()
    expect(() => { consoleProbe.probe(() => {}) }).not.toThrow()
    expect(() => { consoleProbe.probe(consoleProbe) }).not.toThrow()
    expect(() => { consoleProbe.probe(1) }).not.toThrow()
    expect(() => { consoleProbe.probe(-1) }).not.toThrow()
    expect(() => { consoleProbe.probe(0) }).not.toThrow()
    expect(() => { consoleProbe.probe('') }).not.toThrow()
    expect(() => { consoleProbe.probe([]) }).not.toThrow()
    expect(() => { consoleProbe.probe({}) }).not.toThrow()
    expect(() => { consoleProbe.probe(true) }).not.toThrow()
    expect(spyLog).toHaveBeenCalledTimes(17)
  })

  afterAll(() => {
    console.log = consoleLog
  })
})

afterAll(() => {
  console.log()
  consoleProbe(donut)
  consoleProbe.json(donut)
  console.log()
})
