const probe = require('./index')

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

describe('suppressed log tests', () => {
  const spyLog = jest.fn()
  const consoleLog = console.log

  beforeAll(() => {
    console.log = spyLog
  })

  test('console-probe called by console.probe', () => {
    expect(() => console.probe()).toThrow()
    probe.apply()
    console.probe(donut)
    expect(spyLog).toHaveBeenCalled()
  })

  test('console-probe appended to another object', () => {
    const thing = {}
    expect(() => thing.probe()).toThrow()
    probe.apply(thing)
    const probeSpy = jest.spyOn(thing, 'probe')
    thing.probe(donut)
    expect(probeSpy).toHaveBeenCalled()
  })

  test('console-probe stand-alone function', () => {
    const probeFunc = probe.get()
    expect(typeof probeFunc).toBe('function')
    expect(probeFunc).toBe(console.probe)
    expect(probeFunc.toString()).toBe(console.probe.toString())
  })

  test('console-probe type support', () => {
    const probeFunc = probe.get()
    expect(() => { probeFunc() }).not.toThrow()
    expect(() => { probeFunc(null) }).not.toThrow()
    expect(() => { probeFunc(undefined) }).not.toThrow()
    expect(() => { probeFunc(function name () {}) }).not.toThrow()
    expect(() => { probeFunc(() => {}) }).not.toThrow()
    expect(() => { probeFunc(probeFunc) }).not.toThrow()
    expect(() => { probeFunc(1) }).not.toThrow()
    expect(() => { probeFunc(-1) }).not.toThrow()
    expect(() => { probeFunc(0) }).not.toThrow()
    expect(() => { probeFunc('') }).not.toThrow()
    expect(() => { probeFunc([]) }).not.toThrow()
    expect(() => { probeFunc({}) }).not.toThrow()
    expect(() => { probeFunc(true) }).not.toThrow()
  })

  afterAll(() => {
    console.log = consoleLog
  })
})

afterAll(() => {
  console.log()
  probe.get()(donut)
  console.log()
})
