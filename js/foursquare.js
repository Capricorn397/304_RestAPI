'use strict'

const request = require ('https')
const moment = require ('moment')
const fsClientId = '3KCQWKC1IDASXU3SH4KZXBRXSC50ZXIB25LKS5O5QYND22FN' //Foursquare Client Id
const fsClientSecret = '2ZX3W41ODK1MWP44YZ5AGOF532W0PHHU5VVQQOAVYZZX1J1H'//Foursquare Client Secret
const date = new Date()
const formattedDate = moment(date).format('YYYYMMDD')
const baseURL = 'https://api.foursquare.com'

/**
* Searches the foursquare database for venues based on a location and catagory
* @param {float} lat - The latitude of the chosen location
* @param {float} lon - The longitude of the chosen location
* @param {weather} weather - The weather for the location at the chosen time
* @param {string} catID - The foursquare catagory ID chosen to limit results
* @returns {JSON} The returned foursquare venues
*/
module.exports.search = function(lat, lon, weather, catID) {
	return new Promise((fufill) => {
		//make foursquare query url
		const endURL = `/v2/venues/search?ll=${lat},${lon}&categoryId=${catID}&client_id=${fsClientId}&client_secret=${fsClientSecret}&v=${formattedDate}`
		const URL = baseURL + endURL
		//when data is returned add to variable, when end is reached parse and return
		request.get(URL, (res) => {
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

/**
* Gets the up-to-date catagory ID's from foursquare
* @returns {JSON} The returned catagories and ids in JSON format
*/
module.exports.getCategories = () => {
	//create foursquare query
	const catURL = `https://api.foursquare.com/v2/venues/categories?client_id=${fsClientId}&client_secret=${fsClientSecret}&v=${formattedDate}`
	return new Promise((fufill) => {
		request.get(catURL, (res) => {
			//On returned data add to variable, then on end parse and return
			let str = ''
			res.on('data', (d) => {
				str = str + d
			})
			res.on('end', () => {
				const pars = JSON.parse(str)
				const out = {}
				for (const x in pars.response.categories) {
					const temp = pars.response.categories[x].name
					out[ temp ] = pars.response.categories[x].id
				}
				fufill(out)
			})
		})
	})
}
