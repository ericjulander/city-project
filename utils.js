const fs = require('fs')
const path = require('path')
const d3 = require('d3-dsv')
const beautify = require('js-beautify').js
const expect = require('expect')

module.exports.read = function(filename){
  var fullpath = path.join(__dirname,filename)
  expect(fs.existsSync(fullpath)).toBeTruthy()
  return d3.csvParse(fs.readFileSync(fullpath,'utf-8'))
}

module.exports.write = function write(filename,regions){
  var file = fs.createWriteStream(path.join(__dirname,filename))
  expect(regions).toBeInstanceOf(Array)
  regions.forEach(region => {

    expect(region).toHaveProperty('name',expect.any(String))
    file.write(`# ${region.name}\n`) // Writing the Region Name

    expect(region).toHaveProperty('states',expect.any(Array))
    region.states.forEach(state => {

      expect(state).toHaveProperty('name',expect.any(String))
      file.write(` ## ${state.name}\n`) // Writing the State Name

      expect(state).toHaveProperty('cities',expect.any(Array))
      expect(state.cities).toBeInstanceOf(Array)
      state.cities.forEach(city => {

        expect(city).toHaveProperty('name',expect.any(String))
        expect(city).toHaveProperty('population',expect.any(Number))

        // Writing the City name with population
        file.write(`  - ${city.name} ( \`pop. ${city.population.toLocaleString()}\` )\n`)
      })
    })
    file.write('\n')
  })
  file.end()
}

module.exports.prettyprint = data => console.log(beautify(JSON.stringify(data)))