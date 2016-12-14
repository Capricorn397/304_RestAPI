'use strict'
const expect = require('chai').expect
const request = require('request')
const index = require('../js/index.js')
const one = 1
const currentDate = new Date
const dateTime = currentDate.getFullYear() + '-' + (currentDate.getMonth()+one) + '-' + currentDate.getDate() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds()
const httpOK = 200
const regDet = {'user': 'testerUser', 'pass': 'testerPass'}
const Created = 201
index
describe('Checks index.js', function() {
	it('Checks the Search get returns Ok', function(done) {
		request.get(`http://localhost:8000/search?location=coventry&catID=4d4b7105d754a06376d81259&date=${dateTime}`)
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('200')
			done()
		})
	})
	it('Checks the Search get errors correctly', function(done) {
		request.get(`http://localhost:8000/search?location=coventry&catID=4d4b7105d754a063761259&date=${dateTime}`)
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('500')
			done()
		})
	})

	it('Checks the Weather get returns Ok', function(done) {
		request.get(`http://localhost:8000/weather?location=Coventry&time=${dateTime}`)
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('200')
			done()
		})
	})
	it('Checks the Weather get errors correctly', function(done) {
		request.get('http://localhost:8000/weather?location=undefined&time=err')
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('200')
			done()
		})
	})

	it('Checks the Foursquare categories get returns Ok', function(done) {
		request.get('http://localhost:8000/categories')
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('200')
			done()
		})
	})

	it('Checks the Login get returns Ok', function(done) {
		request.get({
			headers: {
				username: 'testUser',
				password: 'test'
			},
			uri: 'http://localhost:8000/login'
		})
		.on('response', (response) => {
			expect(response.statusCode).to.be.equal(httpOK)
			done()
		})
	})
	it('Checks the Login get errors correctly', function(done) {
		request.get({
			headers: {
				username: 'testUser',
				pass: 'wrong'
			},
			uri: 'http://localhost:8000/login'
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('401')
			done()
		})
	})

	it('Checks the Register post returns Ok', function(done) {
		request.post({
			url: 'http://localhost:8000/register',
			form: JSON.stringify(regDet)
		})
		.on('response', (response) => {
			expect(response.statusCode).to.be.equal(Created)
			done()
		})
	})
	it('Checks the Register post errors correctly', function(done) {
		request.post({
			url: 'http://localhost:8000/register',
			form: 'error'
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('500')
			done()
		})
	})

	it('Checks the addFavourite post returns Ok', function(done) {
		request.post({
			url: 'http://localhost:8000/addFavourite',
			form: {
				location: 'TestLoc'
			},
			headers: {
				username: 'testerUser',
				password: 'testerPass'
			}
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('201')
			done()
		})
	})
	it('Checks the addFavourite post errors correctly', function(done) {
		request.post({
			url: 'http://localhost:8000/addFavourite',
			form: {
				location: 'TestLoc'
			},
			headers: {
				username: 'testerUser',
				pass: 'testerPass'
			}
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('500')
			done()
		})
	})

	it('Checks the viewFavourites get returns Ok', function(done) {
		request.get({
			headers: {
				username: 'testerUser',
				password: 'testerPass'
			},
			uri: 'http://localhost:8000/viewFavourites'
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('200')
			done()
		})
	})
	it('Checks the viewFavourite get errors correctly', function(done) {
		request.get({
			headers: {
				username: 'testerUser',
				pass: 'testerPass'
			},
			uri: 'http://localhost:8000/viewFavourites'
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('401')
			done()
		})
	})

	it('Checks the delFavourite delete returns Ok', function(done) {
		request.del({
			headers: {
				username: 'testerUser',
				password: 'testerPass'
			},
			uri: 'http://localhost:8000/delFavourite'
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('200')
			done()
		})
	})
	it('Checks the delFavourite delete errors correctly', function(done) {
		request.del({
			headers: {
				username: 'testerUser',
				pass: 'testerPass'
			},
			uri: 'http://localhost:8000/delFavourite'
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('500')
			done()
		})
	})

	it('Checks the changePassword put returns Ok', function(done) {
		request.put({
			url: 'http://localhost:8000/changePassword',
			form: JSON.stringify({'newPass': 'changedPass'}),
			headers: {
				username: 'testerUser',
				password: 'testerPass'
			}
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('200')
			done()
		})
	})
	it('Checks the changePassword put errors correctly', function(done) {
		request.put({
			url: 'http://localhost:8000/changePassword',
			form: JSON.stringify({'newPass': 'changedPass'}),
			headers: {
				username: 'testerUser',
				pass: 'testerPass'
			}
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('500')
			done()
		})
	})

	it('Checks the delUser delete returns Ok', function(done) {
		request.del({
			headers: {
				username: 'testerUser',
				password: 'testerPass'
			},
			uri: 'http://localhost:8000/delUser'
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('200')
			done()
		})
	})
	it('Checks the delUser delete errors correctly', function(done) {
		request.del({
			headers: {
				username: 'testerUser',
				pass: 'testerPass'
			},
			uri: 'http://localhost:8000/delUser'
		})
		.on('response', (response) => {
			expect(JSON.stringify(response.statusCode)).to.be.equal('500')
			done()
		})
	})
})
