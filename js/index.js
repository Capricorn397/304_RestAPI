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
	version: '0.0.1'
})

/**
* Creates the server on the port 8000
* @returns {NULL} nothing returned server remains on and listening on port
*/
const serv = function(){
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
module.exports.start = function(){
	serv()
}

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
		.catch((err) => res.send(err))
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
				reject(err)
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
			reject(err)
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
		auth.register(req.body).then((token) => fufill(res.send(token)))
		.catch((err) => reject(res.send(err)))
	})
})

//Logs a user in
//INPUT: username (string), password (string)
//OUTPUT: TOKEN (NEEDS REMOVING TO FIT REST REQUIREMENTS)
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
				auth.login(username, pass).then((token) => {
					if (token === false) {
						reject(res.send('Invalid Login'))
					} else {
						hash.hash(token, salt, (err, toke) => {
							if(err) {
								reject(err)
							}
							exports.info.addToken(toke)
							fufill(res.send(toke))
						})
					}
				})
				.catch((err) => reject(res.send(err)))
			})
		})
	})
})

//NEEDS REMOVING DOES NOT FIT REST REQUIREMENTS
server.get('/checkLogin', (req, res) => {
	exports.info.checkToken(req.headers.token).then((check) => {
		if(check === true) {
			res.send('Logged in')
		} else {
			res.send('Not logged in')
		}
	})
	.catch((err) => res.send(err))
})
