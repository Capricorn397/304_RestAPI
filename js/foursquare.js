'use strict'

const request = require ('https')
const moment = require ('moment')
const locConvert = require ('node-geocoder')
const fsClientId = '3KCQWKC1IDASXU3SH4KZXBRXSC50ZXIB25LKS5O5QYND22FN' //Foursquare Client Id
const fsClientSecret = '2ZX3W41ODK1MWP44YZ5AGOF532W0PHHU5VVQQOAVYZZX1J1H'//Foursquare Client Secret
const date = new Date()
const formattedDate = moment(date).format('YYYYMMDD')
const baseURL = 'https://api.foursquare.com'
const options = {
	provider: 'google',
	httpAdapter: 'https',
	formatter: null
}
const geoCoder = locConvert(options)
module.exports.search = function(input) {
	return new Promise(function(fufill, reject){
		geoCoder.geocode(input).then((response, err) => {
			if (err) {
				reject(err)
			}
			const endURL = `/v2/venues/search?ll=52.40,-1.51&client_id=${fsClientId}&client_secret=${fsClientSecret}&v=${formattedDate}` /*`venues/search?ll=${response.latitude},${response.longitude}&client_id=${fsClientId}&client_secret=${fsClientSecret}&v=${formattedDate}`*/
			const URL = baseURL + endURL
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
