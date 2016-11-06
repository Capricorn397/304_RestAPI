'use strict'
const assert = require('assert')
const server = require('../js/index.js')
const logpoint = 0
before(function(){
	server.start()
})
describe('Start server', function(){
	it('Sets the server to listen on port 8080', function(){
		assert.equal(server.info.log[logpoint],'304Server listening at http://[::]:8080','Server Failed to start at correct url')
	})
})
