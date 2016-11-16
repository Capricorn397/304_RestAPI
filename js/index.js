'use strict'
const serverclass = require('./serverinfo.js')
const fourSquare = require('./foursquare.js')
const restify = require('restify')
const error = ''
const port = 8000
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
server.get('/search?coventry', function(){
	console.log ('index pre')
	fourSquare.search('coventry')
	.catch((err) => {
		console.log(err)
	})
	.then((res) => {
		console.log('index post')
		console.log(res)
	})
})
server.get('/api/echo/:name', function(req, res, next) {
	res.send(req.params)
	return next()
})
