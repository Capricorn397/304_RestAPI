'use strict'

module.exports = class serverinfo {
	/**
	* Store server information
	* @param {string} url - The server url
	* @param {Integer} port - the server port
	* @param {string} error - Any error occurances
	* @param {string} name - The name of the server instance
	* @param {string} tokens - The list of tokens of logged in users
	*/
	constructor(url, port, error, name, tokens) {
		this.url = url
		this.port = port
		this.log = []
		this.error = error
		this.name = name
		this.tokens = []
	}

	/**
	* Set url value
	* @param {string} url - The url of the server
	*/
	set urlValue(url){
		this.url = url
	}
	/**
	* Set Port value
	* @param {string} port - The port the server is listening through
	*/
	set portValue(port){
		this.port = port
	}
	/**
	* Add to log key value pairs
	* @param {string} event - An event to be added to the log
	* @returns {Integer} HTML - Returns a status code
	*/
	logEvent(event){
		this.log.push(event)
	}
	/**
	* Set error value
	* @param {string} error - Records error events
	*/
	set errorValue(error){
		this.error = error
	}
	/**
	* Set name value
	* @param {string} name - The name of the server instance
	*/
	set nameValue(name){
		this.name = name
	}
	/**
	* Adds token to liste
	* @param {string} token - The user's login token
	* @returns {Integer} HTML - Returns a status code
	*/
	addToken(token){
		this.tokens.push(token)
	}
	/**
	* Checks for user login token
	* @param {string} token - The token to be checked for
	* @returns {boolean} If token exists in the array
	*/
	checkToken(token){
		return new Promise((fufill, reject) => {
			for (const x in this.tokens) {
				if (token === this.tokens[x]) {
					fufill(true)
				}
			}
			reject(false)
		})
	}
}
