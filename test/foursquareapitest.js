'use strict'
const expect = require('chai').expect
const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
const FS = require('../js/foursquare.js')
const lat = 52.41
const lon = -1.52
const weather = {weather: [{main: 'Rain'}]}
const catID = '4d4b7104d754a06370d81259'
const length = 30
const errCode = 400

chai.use(chaiAsPromised)
chai.should()
describe('Checks foursqaureApi.js', () => {
	it('Checks whether the search function completes', function() {
		FS.search(lat, lon, weather, catID).then((response) => {
			expect(response.response.venues.length).to.equal(length)
		})
	})
	it('Checks whether the search function returns the correct error message', function() {
		FS.search(lat,undefined, weather, catID).then((response) => {
			expect(response.meta.code).to.equal(errCode)
		})
	})
	it('Checks get catagories returns the full list of catagories', function() {
		return (FS.getCategories()).should.eventually.be.fulfilled
	})
})
