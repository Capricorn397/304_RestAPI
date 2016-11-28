'use strict'
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
server.get('/search/:location', function(req, res, next){
	return new Promise(function(fufill, reject) {
		const data = []
		const input = req.params.location
		fourSquare.search(input)
		.then((res, err) => {
			if (err) {
				reject (err)
			}
			for(let x = 0; x < fsTopTen; x++){
				data[x] = res.response.venues[x].name
			}
			fufill(data)
		})
		.then(() => {
			next()
			exports.info.logEvent(`Returned FourSquare Data for ${req.params.location}`)
			return res.send(data)
		})
	})
})
server.get('/api/echo/:name', function(req, res, next) {
	res.send(req.params)
	exports.info.logEvent(`Returned the name ${req.params.name}`)
	next()
})
server.get('/ping', function(req, res){
	return new Promise(function(fufill, reject) {
		exports.info.logEvent('Sent Pong back from ping request')
		fufill(res.send('Pong'))
		reject('error')
	})
})
