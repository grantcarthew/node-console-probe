const cp = require('./console-probe')
const secretIngredient = Symbol('Secret Ingredient')
const hiddenFeature = Symbol('Hidden Feature')

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
  'holeContents': null,
  'reaction': Symbol('Mmmmm...donuts')
}

donut[secretIngredient] = 'Unicorn Tears'
donut[hiddenFeature] = 'Euphoria'

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
    console.probe(donut)
    expect(spyLog).toHaveBeenCalledTimes(1)
    console.json(donut)
    expect(spyLog).toHaveBeenCalledTimes(2)
    console.yaml(donut)
    expect(spyLog).toHaveBeenCalledTimes(3)
  })

  test('console-probe functions appended to another object', () => {
    const thing = {}
    expect(() => thing.probe()).toThrow()
    expect(() => thing.json()).toThrow()
    expect(() => thing.yaml()).toThrow()
    cp.apply(thing)
    const probeSpy = jest.spyOn(thing, 'probe')
    thing.probe(donut)
    expect(probeSpy).toHaveBeenCalledTimes(1)
    const jsonSpy = jest.spyOn(thing, 'json')
    thing.json(donut)
    expect(jsonSpy).toHaveBeenCalledTimes(1)
    const yamlSpy = jest.spyOn(thing, 'yaml')
    thing.yaml(donut)
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
    expect(() => { cp.probe(null) }).not.toThrow()
    expect(() => { cp.probe(undefined) }).not.toThrow()
    expect(() => { cp.probe(function name () {}) }).not.toThrow()
    expect(() => { cp.probe(() => {}) }).not.toThrow()
    expect(() => { cp.probe(cp) }).not.toThrow()
    expect(() => { cp.probe(1) }).not.toThrow()
    expect(() => { cp.probe(-1) }).not.toThrow()
    expect(() => { cp.probe(0) }).not.toThrow()
    expect(() => { cp.probe('') }).not.toThrow()
    expect(() => { cp.probe([]) }).not.toThrow()
    expect(() => { cp.probe({}) }).not.toThrow()
    expect(() => { cp.probe(true) }).not.toThrow()
    expect(spyLog).toHaveBeenCalledTimes(19)
  })

  afterAll(() => {
    console.log = consoleLog
  })
})

afterAll(() => {
  console.log()
  cp.yaml(donut)
  cp.json(donut)
  cp.probe(donut)
  console.log()
})
