'use strict'
const geoCoder = require('./geoCoder.js')
const serverclass = require('./serverinfo.js')
const fourSquare = require('./foursquare.js')
const restify = require('restify')
const error = ''
const port = 8000
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
server.get('/search/:location', function(req, res){
	return new Promise(function(fufill, reject) {
		const data = []
		const weather = 'Clear'
		const input = req.params.location
		console.log('geo pre')
		geoCoder(input).then((response) => {
			console.log('pre-fs.js')
			fourSquare.search(response, weather)
			.then((res) => {
				console.log('post-fs.js')
				for(let x = 0; x < fsTopTen; x++){
					console.log(`adding entry ${res.response.venues[x].name}`)
					data[x] = res.response.venues[x].name
				}
				fufill(data)
			})
			.then(() => {
				console.log(data)
				res.send(data)
			})
			.catch((err) => reject(err))
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
