'use strict'

const locConvert = require ('geocoder')

module.exports = (input) =>
	new Promise((fufill, reject) => {
		locConvert.geocode(input, function(err, res){
			if (err) {
				reject(err)
			} else {
				fufill(res)
			}
		})
	})
