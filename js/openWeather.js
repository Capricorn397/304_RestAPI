'use strict'

const http = require('http')
const apiKey = 'b33a9d84c1ef3bf789910201b1781396'
const baseURL = 'http://api.openweathermap.org'
const time = ['0900','1200','1500']

module.exports.getWeather = function(lat, lng, tme){
	return new Promise(function(fufill, reject) {
		const endURL = '/data/2.5/forecast?lat=52.1&lon=-1.42&APPID=b33a9d84c1ef3bf789910201b1781396&temp=celsius'//`/data/2.5/forecast?lat=${lat}&lon${lng}&APPID=${apiKey}&temp=celsius`
		const URL = baseURL + endURL
		http.get(URL, (res, err) => {
			if (err) {
				reject(err)
			} else {
				let str = ''
				res.on('data', (d) => {
					str = str + d
				})
				res.on('end', () => {
					const parsed = JSON.parse(str)
					fufill(parsed)
				})
			}
		})
	})
}
