'use strict'
const assert = require('assert')
const server = require('../js/index.js')
const http = require('http')
const logpoint = 0
before(function(){
	server.start()
})
describe('Start server', function(){
	it('Sets the server to listen on port 8000', function(){
		assert.equal(server.info.log[logpoint],'304Server listening at http://[::]:8000','Server Failed to start at correct url')
	})
})

describe('Check access with ping pong', () => {
	ping().then((response) => {
		it('Sends a ping request and looks for pong return',() => {
			assert.equal(response, 'Pong', 'Failed to see pong')
		})
	})
})

const ping = function() {
	return new Promise((resolve, reject) => {
		http.get('http://localhost:8000/ping', (res, err) => {
			if (err) {
				reject(err)
			} else {
				resolve(res)
			}
		})
	})
}
