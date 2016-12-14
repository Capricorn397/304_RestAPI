'use strict'
const expect = require('chai').expect
const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
const auth = require('../js/auth.js')
const userInfo = {'user': 'testingUser', 'pass': 'testingPass'}
const favs = {location: 'Test Location'}
const zero = 0

chai.use(chaiAsPromised)
chai.should()
describe('Checks auth.js', function() {
	it('Checks a user can be added to the database', function(done) {
		auth.register(JSON.stringify(userInfo)).then((response) => {
			expect(response).to.be.equal('User Registered')
			done()
		})
	})
	it('Checks a registered user can login', function(done) {
		auth.login('testUser', 'test').then((response) => {
			expect(response).to.be.equal(true)
			done()
		})
	})
	it('Checks an unregistered user is rejected correctly', function(done) {
		auth.login('notRegistered', 'notreg').then(() => {
			done('No Error Thrown')
		}).catch((err) => {
			expect(err).to.be.equal('Not Registered')
			done()
		})
	})
	it('Checks a user\'s salt can be retrieved', function() {
		return (auth.salt('testUser')).should.eventually.be.fulfilled
	})
	it('Checks wrong username fails to get a salt', function(done) {
		auth.salt('notRegistered').then(() => {
			done('No Error Thrown')
		}).catch((err) => {
			expect(err).to.be.equal('Not Registered')
			done()
		})
	})
	it('Checks a user can add to their favourites', function(done) {
		auth.addFavourite('testingUser', JSON.stringify(favs)).then((response) => {
			expect(response).to.be.equal(true)
			done()
		})
	})
	it('Checks a user can view their favourites', function(done) {
		auth.viewFavourite('favtest').then((response) => {
			expect(response.length).to.not.equal(zero)
			done()
		})
	})
	it('Checks a user can delete their favourites', function(done) {
		auth.delFavourite('testingUser').then((response) => {
			expect(response).to.be.equal(true)
			done()
		})
	})
	it('Checks a user can change password', function(done) {
		auth.changePassword('testingUser', JSON.stringify({'newPass': 'newPassword'})).then((response) => {
			expect(response).to.be.equal(true)
			done()
		})
	})
	it('Checks a user can be deleted', function(done) {
		auth.delUser('testingUser').then((response) => {
			expect(response).to.be.equal(true)
			done()
		})
	})
})
