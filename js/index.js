'use strict'
const geoCoder = require('./geoCoder.js')
const weather = require('./openWeather.js')
const serverclass = require('./serverinfo.js')
const fourSquare = require('./foursquare.js')
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
	server.listen(port, function() {
		console.log(`Server at ${server.url}`)
		exports.info.logEvent(`${server.name} listening at ${server.url}`)
	})
}
module.exports.start = function(){
	serv()
}

serv()
server.use(restify.queryParser())
server.get('/search?', function(req, res){
	return new Promise(function(fufill, reject) {
		const data = []
		const input = req.query.location
		const dat = req.query.date
		console.log('geo pre')
		geoCoder(input).then((response) => {
			const lat = response.results[firstArray].geometry.location.lat.toFixed(twoDP)
			const lon = response.results[firstArray].geometry.location.lng.toFixed(twoDP)
			weather.getWeatherTime(lat, lon, dat)
				.then((response) => fourSquare.search(lat, lon, response)
					.then((res) => {
						for(let x = 0; x < fsTopTen; x++){
							data[x] = res.response.venues[x].name
						}
						fufill(data)
					})
					.then(() => {
						console.log(data)
						res.send(data)
					})
					.catch((err) => reject(err)))
		})
		.catch((err) => res.send(err))
	})
})

server.get('/api/echo/:name', function(req, res) {
	res.send(req.params)
})

server.get('/ping', function(req, res){
	res.send('Pong')
	exports.info.logEvent('Sent Pong back from ping request')
})

server.get('/weather', function(req, res){
	return new Promise(function(fufill, reject) {
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
