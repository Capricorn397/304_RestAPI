'use strict'
const expect = require('chai').expect
const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
const FS = require('../js/foursquare.js')
const lat = 52.41
const lon = -1.52
const weather = {weather: [{main: 'Rain'}]}
const catID = '4d4b7104d754a06370d81259'
const length = 10
const errCode = 400

chai.use(chaiAsPromised)
chai.should()
describe('Checks foursqaureApi.js', () => {
	it('Checks whether the search function completes', function(done) {
		FS.search(lat, lon, weather, catID).then((response) => {
			expect(response.locations.length).to.equal(length)
			done()
		})
	})
	it('Checks whether the search function returns the correct error message', function(done) {
		FS.search(lat,undefined, weather, catID).then(() => {
			done('No Error Thrown')
		}).catch((err) => {
			expect(err).to.equal(errCode)
			done()
		})
	})
	it('Checks get catagories returns the full list of catagories', function(done) {
		FS.getCategories().then((res) => {
			expect(res.Food).to.be.equal('4d4b7105d754a06374d81259')
			done()
		})
	})
})
