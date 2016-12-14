'use strict'
const expect = require('chai').expect
const SI = require('../js/serverinfo.js')
const zero = 0

describe('Checks serverinfo.js', function() {
	const testClass = new SI('url', 'port', 'error', 'name')
	it('Checks the url value can be set', function(done) {
		expect(testClass.url).to.be.equal('url')
		done()
	})
	it('Checks the port value can be set', function(done) {
		expect(testClass.port).to.be.equal('port')
		done()
	})
	it('Checks the error value can be set', function(done) {
		expect(testClass.error).to.be.equal('error')
		done()
	})
	it('Checks the name value can be set', function(done) {
		expect(testClass.name).to.be.equal('name')
		done()
	})
	it('Checks an event can be added to the log', function(done) {
		testClass.logEvent('Test Event')
		expect(testClass.log[zero]).to.be.equal('Test Event')
		done()
	})
})
