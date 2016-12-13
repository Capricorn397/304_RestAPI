'use strict'

module.exports = class serverinfo {
	/**
	* Store server information
	* @param {string} url - The server url
	* @param {Integer} port - the server port
	* @param {string} error - Any error occurances
	* @param {string} name - The name of the server instance
	*/
	constructor(url, port, error, name) {
		this.url = url
		this.port = port
		this.log = []
		this.error = error
		this.name = name
	}
	/**
	* Add to log key value pairs
	* @param {string} event - An event to be added to the log
	* @returns {Integer} HTML - Returns a status code
	*/
	logEvent(event){
		this.log.push(event)
	}

}
