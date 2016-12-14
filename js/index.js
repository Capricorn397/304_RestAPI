'use strict'
const geoCoder = require('./geoCoder.js')
const weather = require('./openWeather.js')
const serverclass = require('./serverinfo.js')
const fourSquare = require('./foursquare.js')
const auth = require('./auth.js')
const restify = require('restify')
const error = ''
const port = 8000
const firstArray = 0
const twoDP = 2
const server = restify.createServer({
	name: '304Server',
	version: '0.1.0'
})
const httpCodes = {
	OK: 200,
	Created: 201,
	Unauthorized: 401,
	Forbidden: 403,
	notFound: 404,
	methodNotAllowed: 405,
	requestTimeout: 408,
	internalServerError: 500
}


/**
* Creates the server on the port 8000
* @returns {NULL} nothing returned server remains on and listening on port
*/
const serv = module.exports.testServer = () => {
	exports.info = new serverclass(server.url, port, error, server.name)
	server.listen(port, () => {
		console.log(`Server at ${server.url}`)
		exports.info.logEvent(`${server.name} listening at ${server.url}`)
	})
}
/**
* Function to export starting the server for use in tests
* @returns {NULL} nothing returns just keeps server listening on port
*/

serv()
//Tell the server to parse querys and bodys
server.use(restify.queryParser())
server.use(restify.bodyParser())

//Foursquare search
//INPUT: location (string), catagoryID (string), Date and time (date)
//OUTPUT: JSON results with name, location and links
server.get('/search?', (req, res) => {
	const catID = req.query.catID
	const input = req.query.location
	const dat = req.query.date
	geoCoder(input).then((response) => {
		const lat = response.results[firstArray].geometry.location.lat.toFixed(twoDP)
		const lon = response.results[firstArray].geometry.location.lng.toFixed(twoDP)
		weather.getWeatherTime(lat, lon, dat)
			.then((response) => {
				fourSquare.search(lat, lon, response, catID)
				.then((respo) => {
					res.send(respo)
				}).catch((err) => res.send(httpCodes.internalServerError,err))
			})
	}).catch((err) => res.send(httpCodes.internalServerError, err))
})

//Gets the weather for a given location and time
//INPUT: location (string), date and time (date)
//OUTPUT: JSON of relevant weather data returned
server.get('/weather', (req, res) => {
	geoCoder(req.query.location).then((response) => {
		weather.getWeatherTime(response.results[firstArray].geometry.location.lat.toFixed(twoDP), response.results[firstArray].geometry.location.lng.toFixed(twoDP), req.query.time).then((respons) => {
			res.send(respons)
		})
		.catch((err) => {
			res.send(httpCodes.internalServerError, err)
		})
	})
})

//Get the foursquare catagories with their ID's
//INPUT: none beyond the URL
//OUTPUT: key value pairs of {catagoryName: catagoryID}
server.get('/categories', (req, res) => {
	if (req.query.err === true) {
		throw new Error('Error test')
	} else {
		fourSquare.getCategories().then((response) => {
			res.send(response)
		})
		.catch((err) => {
			res.send(httpCodes.internalServerError, err)
		})
	}
})

//Registers a new user
//INPUT: username (string), password (string)
//OUTPUT: Success or failure message
server.post('/register', (req, res) => {
	auth.register(req.body).then((token) => res.send(httpCodes.Created, token))
	.catch((err) => res.send(httpCodes.internalServerError, err))
})

//Logs a user in
//INPUT: username (string), password (string)
//OUTPUT: Success string
server.get('/login', (req, res) => {
	const username = req.headers.username
	const password = req.headers.password
	auth.login(username, password).then((bool) => {
		if (bool === true) {
			res.send('Success')
		} else {
			res.send(httpCodes.Unauthorized, 'Invalid Login')
		}
	})
	.catch((err) => res.send(httpCodes.Unauthorized, err))
})

//Adds a location to a users favourites
//INPUT: A foursquare location in JSON with link attached
//OUTPUT: HTTP code for added or error
server.post('/addFavourite', (req, res) => {
	const username = req.headers.username
	const password = req.headers.password
	auth.login(username, password).then((bool) => {
		const location = JSON.stringify(req.body)
		if (bool !== true) {
			res.send(httpCodes.Unauthorized)
		} else {
			auth.addFavourite(req.headers.username, location).then((status) => {
				if(status === false) {
					res.send(httpCodes.internalServerError)
				} else {
					res.send(httpCodes.Created)
				}
			}).catch((err) => res.send(httpCodes.internalServerError,err))
		}
	}).catch((err) => {
		if (err === false){
			res.send(httpCodes.Unauthorized)
		} else {
			res.send(httpCodes.internalServerError, err)
		}
	}).catch((err) => res.send(httpCodes.Unauthorized, err))
})

//Get the favourites for a given user
//INPUT: user credentials as headers
//OUTPUT: JSON object of user's favourites
server.get('/viewFavourites', (req, res) => {
	const username = req.headers.username
	const password = req.headers.password
	auth.login(username, password).then((bool) => {
		if (bool !== true) {
			res.send(httpCodes.Unauthorized)
		} else {
			auth.viewFavourite(req.headers.username).then((items) => {
				if(items === false) {
					res.send('No Favourites')
				} else {
					res.send(items[firstArray].favourites)
				}
			}).catch((err) => res.send(httpCodes.internalServerError,err))
		}
	}).catch((err) => {
		res.send(httpCodes.Unauthorized, err)
	})
})

//Delete the favourites for a given user
//INPUT: user credentials as headers
//OUTPUT: Error or OK code
server.del('/delFavourite', (req, res) => {
	const username = req.headers.username
	const password = req.headers.password
	auth.login(username, password).then((bool) => {
		if (bool !== true) {
			res.send(httpCodes.Unauthorized)
		} else {
			auth.delFavourite(req.headers.username).then((status) => {
				if(status === false) {
					res.send(httpCodes.internalServerError)
				} else {
					res.send(httpCodes.OK)
				}
			}).catch((err) => res.send(httpCodes.internalServerError,err))
		}
	}).catch((err) => {
		if (err === false){
			res.send(httpCodes.Unauthorized)
		} else {
			res.send(httpCodes.internalServerError, err)
		}
	})
})

//Delete a user
//INPUT: user credentials as headers
//OUTPUT: Error or an OK code
server.del('/delUser', (req, res) => {
	const username = req.headers.username
	const password = req.headers.password
	auth.login(username, password).then((bool) => {
		if (bool !== true) {
			res.send(httpCodes.Unauthorized)
		} else {
			auth.delUser(req.headers.username).then((status) => {
				if(status === false) {
					res.send(httpCodes.internalServerError)
				} else {
					res.send(httpCodes.OK)
				}
			}).catch((err) => res.send(httpCodes.internalServerError,err))
		}
	}).catch((err) => {
		if (err === false){
			res.send(httpCodes.Unauthorized)
		} else {
			res.send(httpCodes.internalServerError, err)
		}
	})
})

//Changes a user's password
//INPUT: user credentials as headers and a body with the new password
//OUTPUT: Error or an OK code
server.put('/changePassword', (req, res) => {
	const newPass = req.body
	const username = req.headers.username
	const password = req.headers.password
	auth.login(username, password).then((bool) => {
		if (bool !== true) {
			res.send(httpCodes.Unauthorized)
		} else {
			auth.changePassword(req.headers.username, newPass).then((status) => {
				if(status === false) {
					res.send(httpCodes.internalServerError)
				} else {
					res.send(httpCodes.OK)
				}
			}).catch((err) => res.send(httpCodes.internalServerError, err))
		}
	}).catch((err) => {
		if (err === false){
			res.send(httpCodes.Unauthorized)
		} else {
			res.send(httpCodes.internalServerError, err)
		}
	})
})

//All below routes are for delivering Pages/HTML/JavaScript for the frontend
server.get('/home.html', restify.serveStatic({
	directory: './views',
	file: 'home.html'
}))
server.get('views/addOns/timePicker.js', restify.serveStatic({
	directory: './views/addOns',
	file: 'timePicker.js'
}))
server.get('views/addOns/timePickerCSS.css', restify.serveStatic({
	directory: './views/addOns',
	file: 'timePickerCSS.css'
}))
