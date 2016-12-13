'use strict'
const expect = require('chai').expect
const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
const auth = require('../js/auth.js')
const userInfo = {user: 'testingUser', pass: 'testingPass'}
const favs = {location: 'Test Location'}
const zero = 0
const pass = '$2a$10$v/.NYMxupes5Vpa34u9BU.2whU4VHgobC8te8bYMbL.4aZs.g29Au'

chai.use(chaiAsPromised)
chai.should()
describe('Checks auth.js', function() {
	it('Checks a user can be added to the database', function() {
		auth.register(userInfo).then((response) => {
			expect(response).to.be.equal('User Registered')
		})
	})
	it('Checks addUser throws errors correctly', function() {
		return (auth.register({user: 'favtest', pass: 'test'})).should.eventually.be.rejected
	})
	it('Checks a registered user can login', function() {
		auth.login('testUser', pass).then((response) => {
			expect(response).to.be.equal(true)
		})
	})
	it('Checks a wrong user+password combination is rejected correctly', function() {
		return (auth.login({user: 'testUser', pass: 'wrong'})).should.eventually.be.rejected
	})
	/*it('Checks an unregistered user is rejected correctly', function() {
		return (auth.login({user: null, pass: null})).should.eventually.be.rejected
	})*/
	it('Checks a user\'s salt can be retrieved', function() {
		return (auth.salt('testUser')).should.eventually.be.fulfilled
	})
	it('Checks wrong username fails to get a salt', function(done) {
		auth.salt('notRegistered').then(() => {
			done('No Error Thrown')
		}).catch((err) => {
			expect(err).to.be.equal(false)
			done()
		})
	})
	it('Checks a user can add to their favourites', function() {
		auth.addFavourite('testingUser', JSON.stringify(favs)).then((response) => {
			expect(response).to.be.equal(true)
		})
	})
	it('Checks addFavourite errors correctly', function(done) {
		auth.addFavourite(undefined, undefined).then(() => {
			done('No error thrown')
		}).catch((err) => {
			expect(err).to.not.equal(null)
		})
	})
	it('Checks a user can view their favourites', function() {
		auth.viewFavourite('testingUser').then((response) => {
			expect(response.length).to.not.equal(zero)
		})
	})
	it('Checks a user can delete their favourites', function() {
		auth.delFavourite('testingUser').then((response) => {
			expect(response).to.be.equal(true)
		})
	})
	it('Checks a user with no favourites throws an error', function(done) {
		auth.delFavourite('notRegistered').then(() => {
			done('No error thrown')
		}).catch((err) => {
			expect(err).to.not.equal(undefined)
		})
	})
	it('Checks a user can change password', function() {
		auth.changePassword('testingUser', 'newPassword').then((response) => {
			expect(response).to.be.equal(true)
		})
	})
	it('Checks a user can be deleted', function() {
		auth.delUser('testingUser').then((response) => {
			expect(response).to.be.equal(true)
		})
	})
})
