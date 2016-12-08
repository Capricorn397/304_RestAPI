'use strict'

const hash = require('bcrypt')
const sql = require('mysql')
//SQL database information
const pool = sql.createPool({
	user: 'restAPI',
	password: '304RestApi',
	host: '164.132.195.20',
	port: 7999,
	database: 'restAPI',
	connectionLimit: 10
})
//Avoiding magic numbers
const zero = 0
const sLength = 10

/**
* Takes a username and password and checks against the database to validate a login
* @param {string} username - The username of the user trying to login
* @param {string} password - The (should be hashed) passsword of the user trying to login
* @returns {boolean} if the user credentials were correct
*/
module.exports.login = (username, password) => {
	console.log('Pre-SQL Request')
	return new Promise((fufill, reject) => {
		//create SQL query
		const loginQuery = `SELECT username FROM Users WHERE username='${username}' AND password='${password}'`
		//start connection to database and send query
		pool.query(loginQuery, (err, rows) => {
			if (err) {
				console.log(err)
				reject(err)
			}
			//if no rows returned fail login else return true
			if (rows.length === zero) {
				reject(false)
			} else {
				fufill(true)
			}
		})
	})
}

/**
* Registers a user, saving a salt and hashed password with their username
* @param {JSON} body - the body of the post request including the username and unhashed or salted password
* @returns {string} Successful registration message
*/
module.exports.register = (body) => {
	console.log(body)
	return new Promise((fufill, reject) => {
		//generates a salt to be added for the hashing
		hash.genSalt(sLength, (err, salt) => {
			if (err) {
				reject(err)
			}
			//hashes the password using the salt as extra security
			hash.hash(body.pass, salt, (err, hash) => {
				if(err) {
					reject(err)
				}
				//Create sql query
				const regQuery = `INSERT INTO restAPI.Users (\`username\`,\`password\`,\`salt\`) VALUES ('${body.user}','${hash}','${salt}')`
				console.log(regQuery)
				//save username, hashed password and salt to database
				pool.query(regQuery, (err) => {
					if (err) {
						console.log(err)
						reject(err)
					} else {
						fufill('User Registered')
					}
				})
			})
		})
	})
}

/**
* Returns a users salt for use in logging in
* @param {string} username - The username used to get the correct salt
* @returns {string} The given users salt
*/
module.exports.salt = (username) => {
	console.log('Getting Salt')
	return new Promise((fufill, reject) => {
		//create sql query
		const saltQuery = `SELECT salt FROM Users WHERE username='${username}'`
		pool.query(saltQuery, (err, rows) => {
			if (err) {
				reject(err)
			}
			//if no returned rows send error, else return the found salt
			if (rows.length === zero) {
				reject(false)
			} else {
				fufill(rows[zero].salt)
			}
		})
	})
}

/**
* Adds a Foursquare location to a users favourites
* @param {string} user - the username of the user
* @param {string} location - a stringified JSON of the name and link to a foursquare venues
* @returns {boolean} If the add was Successful
*/
module.exports.addFavourite = (user, location) => {
	console.log('add favourite')
	return new Promise((fufill, reject) => {
		const favQuery = `INSERT INTO restAPI.favourites (\`username\`, \`favourites\`) VALUES ('${user}', '${location}')`
		pool.query(favQuery, (err) => {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				fufill(true)
			}
		})
	})
}

module.exports.viewFavourite = (user) => {
	console.log('view favourites')
	return new Promise((fufill, reject) => {
		const getFavQuery = `SELECT favourites FROM favourites WHERE username='${user}'`
		pool.query(getFavQuery, (err, rows) => {
			if (err) {
				console.log(err)
				reject(err)
			}
			if (rows.length === zero) {
				reject(false)
			} else {
				fufill(rows)
			}
		})
	})
}

module.exports.delFavourite = (user, location) => {
	console.log('delete favourites')
	return new Promise((fufill, reject) => {
		const delFavQuery = `DELETE FROM favourites WHERE username='${user}' AND favourites='${location}'`
		pool.query(delFavQuery, (err) => {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				fufill(true)
			}
		})
	})
}

module.exports.changePassword = (user, newPass) => {
	console.log('Change Password')
	return new Promise((fufill, reject) => {
		//generates a salt to be added for the hashing
		hash.genSalt(sLength, (err, salt) => {
			if (err) {
				reject(err)
			}
			//hashes the password using the salt as extra security
			hash.hash(newPass, salt, (err, hash) => {
				if(err) {
					reject(err)
				}
				const passQuery = `UPDATE Users SET password='${hash}', salt='${salt}' WHERE username='${user}'`
				pool.query(passQuery, (err) => {
					if (err) {
						console.log(err)
						reject(err)
					} else {
						fufill(true)
					}
				})
			})
		})
	})
}
