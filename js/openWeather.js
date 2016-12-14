'use strict'

const http = require('http')
const apiKey = 'b33a9d84c1ef3bf789910201b1781396'
const baseURL = 'http://api.openweathermap.org'

/**
* Gets the nearest time to chosen from the 3 hour weather given from openweather
* @param {float} lat - The latitude value of the chosen location
* @param {float} lng - The longitude value of the chosen location
* @param {date} tme - The date and time for the weather to be gotten from
* @returns {date} The chosen closest time
*/
exports.getWeatherTime = (lat, lng, tme) =>
	new Promise((resolve, reject) => {
		const userDate = new Date(tme)
		getWeather(lat, lng).then((response) => {
			resolve(response.list.reduce((acc, val) => {
				//Set each with a date from the openWeather return and the chosen date then compare which is closest and return that date					const accDate = new Date(acc.dt_txt)
				const accDate = new Date(acc.dt_txt)
				const valDate = new Date(val.dt_txt)
				const accDateAccuracy = Math.abs(accDate.getTime() - userDate.getTime())
				const valDateAccuracy = Math.abs(valDate.getTime() - userDate.getTime())
				return accDateAccuracy > valDateAccuracy ? val : acc
			}))
			//Catch any random errors
		}).catch(reject)
	})

/**
* Gets the 5 day (every 3 hours) weather forecast for a chosen location
* @param {float} lat - The latitude of the chosen location
* @param {float} lng - The longitude of the chosen location
* @returns {JSON} The returned JSON data from openWeather
*/
const getWeather = module.exports.testGet = (lat, lng) => {
	const endURL = `/data/2.5/forecast?lat=${lat}&lon=${lng}&APPID=${apiKey}&temp=celsius`
	//console.log to stop eslint warning with arrow functions immediately followed by return
	return new Promise((fufill) => {
		//set openWeather URL
		const URL = baseURL + endURL
		//openWeather request
		http.get(URL, (res) => {
			//on data add to variable, when data reaches the end parse and return
			let str = ''
			res.on('data', (d) => {
				str = str + d
			})
			res.on('end', () => {
				const parsed = JSON.parse(str)
				fufill(parsed)
			})
		})
	})
}
