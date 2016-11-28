'use strict'

const locConvert = require ('geocoder')

module.exports = (input) =>
	new Promise((fufill, reject) => {
		locConvert.geocode(input, function(err, res){
			if (err) {
				console.log('geocoder error')
				reject(err)
			} else {
				console.log('Geocoded')
				fufill(res)
			}
		})
	})
