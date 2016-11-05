'use strict'
const assert = require('assert')
const n1 = -1
const n2 = 1
const n3 = 2
const n4 = 3
const n5 = 4
describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal(n1, [n2,n3,n4].indexOf(n5))
		})
	})
})
