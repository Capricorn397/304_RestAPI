'use strict'
const geoCoder = require('./geoCoder.js')
const hash = require('bcrypt')
const weather = require('./openWeather.js')
const serverclass = require('./serverinfo.js')
const fourSquare = require('./foursquare.js')
const auth = require('./auth.js')
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
const serv = function(){
	exports.info = new serverclass(server.url, port, error, server.name)
	server.listen(port, () => {
		console.log(`Server at ${server.url}`)
		exports.info.logEvent(`${server.name} listening at ${server.url}`)
	})
}
module.exports.start = function(){
	serv()
}

serv()
server.use(restify.queryParser())
server.use(restify.bodyParser())
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

server.get('/echo/:name', (req, res) => {
	console.log(`Echoing ${req.params.name}`)
	res.send(req.params)
})

server.get('/ping', (req, res) => {
	console.log('Ping Request')
	res.send('Pong')
	exports.info.logEvent('Sent Pong back from ping request')
})

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

server.post('/register', (req, res) => {
	console.log('Register User')
	return new Promise((fufill, reject) => {
		console.log(req.body.pass)
		auth.register(req.body).then((token) => fufill(res.send(token)))
		.catch((err) => reject(res.send(err)))
	})
})

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
