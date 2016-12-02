'use strict'

const firstArray = 0
const request = require ('https')
const moment = require ('moment')
const fsClientId = '3KCQWKC1IDASXU3SH4KZXBRXSC50ZXIB25LKS5O5QYND22FN' //Foursquare Client Id
const fsClientSecret = '2ZX3W41ODK1MWP44YZ5AGOF532W0PHHU5VVQQOAVYZZX1J1H'//Foursquare Client Secret
const date = new Date()
const formattedDate = moment(date).format('YYYYMMDD')
const baseURL = 'https://api.foursquare.com'

module.exports.search = function(lat, lon, weather, catID) {
	return new Promise(function(fufill, reject){
		console.log(`Weather is ${JSON.stringify(weather.weather[firstArray].main)}`)
		const endURL = `/v2/venues/search?ll=${lat},${lon}&categoryId=${catID}&client_id=${fsClientId}&client_secret=${fsClientSecret}&v=${formattedDate}`
		const URL = baseURL + endURL
		console.log(URL)
		request.get(URL, (res, err) => {
			if (err) {
				reject(err)
			}
			let str = ''
			res.on('data', (d) => {
				str = str + d
			})
			res.on('end', () => {
				const parsed = JSON.parse(str)
				fufill(parsed)
			})
		})
	}
)}

module.exports.getCategories = () => {
	const catURL = `https://api.foursquare.com/v2/venues/categories?client_id=${fsClientId}&client_secret=${fsClientSecret}&v=${formattedDate}`
	return new Promise((fufill, reject) => {
		request.get(catURL, (res, err) => {
			if (err) {
				reject(err)
			} else {
				let str = ''
				res.on('data', (d) => {
					str = str + d
				})
				res.on('end', () => {
					const pars = JSON.parse(str)
					fufill(pars)
				})
			}
		})
	})
}
