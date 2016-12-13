'use strict'
const expect = require('chai').expect
const SI = require('../js/serverinfo.js')
const zero = 0

describe('Checks serverinfo.js', function() {
	const testClass = new SI('url', 'port', 'error', 'name')
	it('Checks the url value can be set', function() {
		expect(testClass.url).to.be.equal('url')
	})
	it('Checks the port value can be set', function() {
		expect(testClass.port).to.be.equal('port')
	})
	it('Checks the error value can be set', function() {
		expect(testClass.error).to.be.equal('error')
	})
	it('Checks the name value can be set', function() {
		expect(testClass.name).to.be.equal('name')
	})
	it('Checks an event can be added to the log', function() {
		testClass.logEvent('Test Event')
		expect(testClass.log[zero]).to.be.equal('Test Event')
	})
})
