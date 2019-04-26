const utils = require('./utils')
const actual = jest.requireActual('./utils')

jest.mock('./utils')

utils.read.mockImplementation(actual.read)

require('./main.js')

describe('Challenge #1 - Grouping data',() => {

  test('reads from csv file',() => {
    expect(utils.read).toBeCalledTimes(1)
    expect(utils.read).toBeCalledWith(expect.stringMatching(/\.csv$/))
  })

  test('writes to markdown file', () => {
    expect(utils.write).toBeCalledTimes(1)
    expect(utils.write).toBeCalledWith(expect.stringMatching(/\.md$/),expect.any(Object))
  })

  test('has correct output format',() => {
    
    var regions = utils.write.mock.calls[0][1]

    expect(regions).toBeInstanceOf(Array)
    
    expect(regions[0]).toMatchObject({
      name:expect.any(String),
      states:expect.any(Array)
    })
    expect(regions[0].states[0]).toMatchObject({
      name:expect.any(String),
      cities:expect.any(Array)
    })
    expect(regions[0].states[0].cities[0]).toMatchObject({
      name:expect.any(String),
      population:expect.any(Number)
    })
  })

  test('contains New York City',() => {
    expect(utils.write).toBeCalledWith(expect.any(String),expect.arrayContaining([{
      name:'Northeast',
      states:expect.arrayContaining([{
        name:'New York',
        cities:expect.arrayContaining([{
          name:'New York, NY',
          population:8622698
        }])
      }])
    }]))
  })
})

describe('Challenge #2 - Sorting',() => {

  test('running on more than 50 cities', () => {
    var numcities = 0
    utils.write.mock.calls[0][1].forEach(region => region.states.forEach(state => numcities += state.cities.length))
    expect(numcities).toBeGreaterThanOrEqual(50)
  })
  
  test('States are in alphabetical order',() => {
    utils.write.mock.calls[0][1].forEach(region => {
      var statenames = region.states.map(n => n.name)
      expect(statenames).toEqual(statenames.slice().sort())
    })
  })

  test('Cities are ordered by population',() => {
    utils.write.mock.calls[0][1].forEach(region => {
      region.states.forEach(state => {
        expect(state.cities).toEqual(state.cities.slice().sort((a,b) => b.population-a.population))
      })
    })
  })

  test('Regions are sorted West to East',() => {
    expect(utils.write.mock.calls[0][1].map(n => n.name)).toEqual(['Pacific', 'Mountain', 'Midwest', 'South', 'Northeast'])
  })

})