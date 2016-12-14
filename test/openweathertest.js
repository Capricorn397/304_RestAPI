'use strict'
const assert = require('assert')
const oW = require('../js/openWeather.js')
const lat = 52.41
const lon = -1.52
const one = 1
const zero = 0
const httpOk = 200
const currentDate = new Date
const dateTime = currentDate.getFullYear() + '-' + (currentDate.getMonth()+one) + '-' + currentDate.getDate() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds()

describe('Checks openWeather', function() {
	this.timeout(zero)
	it('Checks if a getWeather function returns weather data', (done) => {
		oW.testGet(lat, lon).then((response) => {
			assert.equal(response.cod , httpOk, 'Incorrect returned JSON')
			done()
		}).catch(done)
	})
	it('Checks if a getWeather function error returns', (done) => {
		oW.testGet(undefined, undefined).then((response) => {
			assert.notEqual(response.cod , httpOk, 'Incorrect error output')
			done()
		}).catch(done)
	})
	it('Checks if a getWeatherTime function returns sorted weather data', (done) => {
		oW.getWeatherTime(lat, lon, dateTime).then((response) => {
			assert.notEqual(response.weather[zero].main , undefined, 'Incorrect returned Data')
			done()
		}).catch(done)
	})
})
