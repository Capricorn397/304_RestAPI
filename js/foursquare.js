'use strict'

const firstArray = 0
const twoDP = 2
const request = require ('https')
const moment = require ('moment')
const fsClientId = '3KCQWKC1IDASXU3SH4KZXBRXSC50ZXIB25LKS5O5QYND22FN' //Foursquare Client Id
const fsClientSecret = '2ZX3W41ODK1MWP44YZ5AGOF532W0PHHU5VVQQOAVYZZX1J1H'//Foursquare Client Secret
const date = new Date()
const formattedDate = moment(date).format('YYYYMMDD')
const baseURL = 'https://api.foursquare.com'

module.exports.search = function(location, weather) {
	return new Promise(function(fufill, reject){
		const endURL = `/v2/venues/search?ll=${location.results[firstArray].geometry.location.lat.toFixed(twoDP)},${location.results[firstArray].geometry.location.lng.toFixed(twoDP)}&client_id=${fsClientId}&client_secret=${fsClientSecret}&v=${formattedDate}`
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
