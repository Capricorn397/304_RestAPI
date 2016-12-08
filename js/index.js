'use strict'
const geoCoder = require('./geoCoder.js')
const weather = require('./openWeather.js')
const serverclass = require('./serverinfo.js')
const fourSquare = require('./foursquare.js')
const auth = require('./auth.js')
const hash = require('bcrypt')
const restify = require('restify')
const error = ''
const port = 8000
const firstArray = 0
const twoDP = 2
const fsTopTen = 10
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
const serv = () => {
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
module.exports.start = () => serv()

serv()
//Tell the server to parse querys and bodys
server.use(restify.queryParser())
server.use(restify.bodyParser())

//Foursquare search
//INPUT: location (string), catagoryID (string), Date and time (date)
//OUTPUT: JSON results with name, location and links
server.get('/search?', (req, res) => {
	console.log(`Foursquare search for ${req.query.location} with weather at date and time - ${req.query.date}`)
	return new Promise((fufill, reject) => {
		const data = []
		const catID = req.query.catID
		const input = req.query.location
		const dat = req.query.date
		geoCoder(input).then((response) => {
			const lat = response.results[firstArray].geometry.location.lat.toFixed(twoDP)
			const lon = response.results[firstArray].geometry.location.lng.toFixed(twoDP)
			weather.getWeatherTime(lat, lon, dat)
				.then((response) => fourSquare.search(lat, lon, response, catID)
					.then((res) => {
						for(let x = 0; x < fsTopTen; x++){
							data[x] = res.response.venues[x].name
						}
						fufill(data)
					})
					.then(() => {
						res.send(data)
					})
					.catch((err) => reject(err)))
		})
		.catch((err) => res.send(httpCodes.internalServerError, err))
	})
})

//Echo for any given string
//INPUT: the text given after /echo
//OUTPUT: JSON with the text given after /echo
server.get('/echo/:name', (req, res) => {
	console.log(`Echoing ${req.params.name}`)
	res.send(req.params)
})

//Ping pong request
//INPUT: none beyond ping URL
//OUTPUT: JSON pong string
server.get('/ping', (req, res) => {
	console.log('Ping Request')
	res.send('Pong')
	exports.info.logEvent('Sent Pong back from ping request')
})

//Gets the weather for a given location and time
//INPUT: location (string), date and time (date)
//OUTPUT: JSON of relevant weather data returned
server.get('/weather', (req, res) => {
	console.log('Direct Weather Search')
	return new Promise((fufill, reject) => {
		geoCoder(req.query.location).then((response) => {
			weather.getWeatherTime(response.results[firstArray].geometry.location.lat.toFixed(twoDP), response.results[firstArray].geometry.location.lng.toFixed(twoDP), req.query.time).then((respons) => {
				fufill(res.send(respons))
			})
			.catch((err) => {
				reject(res.send(httpCodes.internalServerError, err))
			})
		})
	})
})

//Get the foursquare catagories with their ID's
//INPUT: none beyond the URL
//OUTPUT: key value pairs of {catagoryName: catagoryID}
server.get('/categories', (req, res) => {
	console.log('FourSquare Catagories')
	return new Promise((fufill, reject) => {
		fourSquare.getCategories().then((response) => {
			const out = {}
			for (const x in response.response.categories) {
				const temp = response.response.categories[x].name
				out[ temp ] = response.response.categories[x].id
			}
			fufill(res.send(out))
		})
		.catch((err) => {
			reject(res.send(httpCodes.internalServerError, err))
		})
	})
})

//Registers a new user
//INPUT: username (string), password (string)
//OUTPUT: Success or failure message
server.post('/register', (req, res) => {
	console.log('Register User')
	return new Promise((fufill, reject) => {
		console.log(req.body.pass)
		auth.register(req.body).then((token) => fufill(res.send(httpCodes.Created, token)))
		.catch((err) => reject(res.send(httpCodes.internalServerError, err)))
	})
})

//Logs a user in
//INPUT: username (string), password (string)
//OUTPUT: Success string
server.get('/login', (req, res) => {
	console.log('Login')
	return new Promise((fufill, reject) => {
		const username = req.headers.username
		const password = req.headers.password
		auth.salt(username).then((salt) => {
			hash.hash(password, salt, (err, pass) => {
				if(err) {
					reject(err)
				}
				console.log(`${username} & ${pass}`)
				auth.login(username, pass).then((bool) => {
					if (bool === false) {
						reject(res.send('Invalid Login'))
					} else {
						if(err) {
							reject(err)
						}
						fufill(res.send('Success'))
					}
				})
				.catch((err) => reject(res.send(httpCodes.Unauthorized, err)))
			})
		})
	})
})

//Adds a location to a users favourites
//INPUT: A foursquare location in JSON with link attached
//OUTPUT: HTTP code for added or error
server.post('/addFavourite', (req, res) => {
	console.log('Add Favourite')
	return new Promise((fufill, reject) => {
		auth.salt(req.headers.username).then((salt) => {
			hash.hash(req.headers.password, salt, (err, pass) => {
				if (err) {
					reject(err)
				}
				const location = JSON.stringify(req.body)
				auth.login(req.headers.username, pass).then((bool) => {
					if (bool === false) {
						err = 'Unauthorized'
						reject(err)
					} else {
						auth.addFavourite(req.headers.username, location).then((status) => {
							if(status === false) {
								res.send(httpCodes.internalServerError)
							} else {
								res.send(httpCodes.Created)
							}
						}).catch((err) => reject(err))
					}
				})
				.catch((err) => {
					if (err === false){
						reject(res.send(httpCodes.Unauthorized))
					} else {
						reject(res.send(httpCodes.internalServerError, err))
					}
				})
			})
		}).catch((err) => reject(res.send(httpCodes.Unauthorized, err)))
	})
})

server.get('/viewFavourites', (req, res) => {
	console.log('View Favourites')
	return new Promise((fufill, reject) => {
		auth.salt(req.headers.username).then((salt) => {
			hash.hash(req.headers.password, salt, (err, pass) => {
				if (err) {
					reject(err)
				}
				auth.login(req.headers.username, pass).then((bool) => {
					if (bool === false) {
						reject(res.send(httpCodes.Unauthorized))
					} else {
						auth.viewFavourite(req.headers.username).then((items) => {
							if(items === false) {
								res.send('No Favourites')
							} else {
								res.send(items)
							}
						}).catch((err) => reject(err))
					}
				})	.catch((err) => {
					if (err === false){
						reject(res.send(httpCodes.Unauthorized))
					} else {
						reject(res.send(httpCodes.internalServerError, err))
					}
				})
			})
		})
	})
})

server.del('/delFavourite', (req, res) => {
	console.log('Delete Favourite')
	return new Promise((fufill, reject) => {
		auth.salt(req.headers.username).then((salt) => {
			hash.hash(req.headers.password, salt, (err, pass) => {
				if (err) {
					reject(err)
				}
				const location = JSON.stringify(req.body)
				auth.login(req.headers.username, pass).then((bool) => {
					if (bool === false) {
						reject(res.send(httpCodes.Unauthorized))
					} else {
						auth.delFavourite(req.headers.username, location).then((status) => {
							if(status === false) {
								res.send(httpCodes.internalServerError)
							} else {
								res.send(httpCodes.OK)
							}
						}).catch((err) => reject(err))
					}
				})	.catch((err) => {
					if (err === false){
						reject(res.send(httpCodes.Unauthorized))
					} else {
						reject(res.send(httpCodes.internalServerError, err))
					}
				})
			})
		})
	})
})

server.put('/changePassword', (req, res) => {
	console.log('Change Password')
	return new Promise((fufill, reject) => {
		auth.salt(req.headers.username).then((salt) => {
			hash.hash(req.headers.password, salt, (err, pass) => {
				if (err) {
					reject(err)
				}
				const newPass = req.body.newPass
				auth.login(req.headers.username, pass).then((bool) => {
					if (bool === false) {
						reject(res.send(httpCodes.Unauthorized))
					} else {
						auth.changePassword(req.headers.username, newPass).then((status) => {
							if(status === false) {
								res.send(httpCodes.internalServerError)
							} else {
								res.send(httpCodes.OK)
							}
						}).catch((err) => reject(err))
					}
				})	.catch((err) => {
					if (err === false){
						reject(res.send(httpCodes.Unauthorized))
					} else {
						reject(res.send(httpCodes.internalServerError, err))
					}
				})
			})
		})
	})
})
