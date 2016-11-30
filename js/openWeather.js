'use strict'

const http = require('http')
const apiKey = 'b33a9d84c1ef3bf789910201b1781396'
const baseURL = 'http://api.openweathermap.org'

exports.getWeatherTime = (lat, lng, tme) =>
	new Promise((resolve, reject) => {
		const userDate = new Date(tme)
		getWeather(lat, lng).then((response) => {
			resolve(response.list.reduce((acc, val) => {
				if (typeof acc === 'undefined') {
					return val
				} else {
					const accDate = new Date(acc.dt_txt)
					const valDate = new Date(val.dt_txt)
					const accDateAccuracy = Math.abs(accDate.getTime() - userDate.getTime())
					const valDateAccuracy = Math.abs(valDate.getTime() - userDate.getTime())
					return accDateAccuracy > valDateAccuracy ? val : acc
				}
			}))
		}).catch(reject)
	})

const getWeather = function(lat, lng){
	return new Promise(function(fufill, reject) {
		const endURL = `/data/2.5/forecast?lat=${lat}&lon=${lng}&APPID=${apiKey}&temp=celsius`
		const URL = baseURL + endURL
		console.log(URL)
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
