'use strict'

const request = require ('https')
const moment = require ('moment')
const locConvert = require ('geocoder')
const fsClientId = '3KCQWKC1IDASXU3SH4KZXBRXSC50ZXIB25LKS5O5QYND22FN' //Foursquare Client Id
const fsClientSecret = '2ZX3W41ODK1MWP44YZ5AGOF532W0PHHU5VVQQOAVYZZX1J1H'//Foursquare Client Secret
const date = new Date()
const formattedDate = moment(date).format('YYYYMMDD')
const baseURL = 'https://api.foursquare.com'

module.exports.search = function(input) {
	return new Promise(function(fufill, reject){
		locConvert.geocode(input, function(err, res) {
			if (err) {
				reject(err)
			}
			console.log(res.results[0].geometry.location)
			const endURL = `/v2/venues/search?ll=${res.results[0].geometry.location.lat.toFixed(2)},${res.results[0].geometry.location.lng.toFixed(2)}&client_id=${fsClientId}&client_secret=${fsClientSecret}&v=${formattedDate}`
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
	)})
}
