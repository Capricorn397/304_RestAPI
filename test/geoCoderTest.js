'use strict'
const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
const geoCoder = require('../js/geoCoder.js')


chai.use(chaiAsPromised)
chai.should()
describe('Checks geoCoder', () => {
	it('Checks if a location is geocoded correctly', function() {
		return (geoCoder('Coventry')).should.eventually.be.fulfilled
	})
	it('Checks if an invalid location is error thrown correctly', function() {
		return (geoCoder(undefined)).should.eventually.be.rejected
	})
})
