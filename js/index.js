'use strict'
const serverclass = require('./serverinfo.js')
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
		exports.info.logEvent(`${server.name} listening at ${server.url}`)
	})
}
module.exports.start = function(){
	serv()
}

serv()
server.get('/ping', function(req, res, next){
	res.send('Png')
	exports.info.logEvent('Sent Pong back from ping request')
	return next()
})
