'use strict'

const locConvert = require ('geocoder')

/**
* Changes a location into latitude and longitude using the google apiKey
* @param {string} input - The chosen location
* @returns {JSON} The geocoder data including the latitude and longitude
*/
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
