'use strict'

const hash = require('bcrypt')
const sql = require('mysql')
const pool = sql.createPool({
	user: 'restAPI',
	password: '304RestApi',
	host: '164.132.195.20',
	port: 7999,
	database: 'restAPI',
	connectionLimit: 10
})
const zero = 0
const sLength = 10

module.exports.login = (username, password) => {
	console.log('Pre-SQL Request')
	return new Promise((fufill, reject) => {
		const loginQuery = `SELECT username FROM Users \
												WHERE username='${username}' \
												AND password='${password}'`
		pool.query(loginQuery, (err, rows) => {
			if (err) {
				console.log(err)
				reject(err)
			}
			if (rows.length === zero) {
				reject(false)
			} else {
				fufill(rows[zero].username)
			}
		})
	})
}
module.exports.register = (body) => {
	console.log(body)
	return new Promise((fufill, reject) => {
		hash.genSalt(sLength, (err, salt) => {
			if (err) {
				reject(err)
			}
			hash.hash(body.pass, salt, (err, hash) => {
				if(err) {
					reject(err)
				}
				const regQuery = `INSERT INTO restAPI.Users (\`username\`,\`password\`,\`salt\`) VALUES ('${body.user}','${hash}','${salt}')`
				console.log(regQuery)
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
module.exports.salt = (username) => {
	console.log('Getting Salt')
	return new Promise((fufill, reject) => {
		const saltQuery = `SELECT salt FROM Users WHERE username='${username}'`
		pool.query(saltQuery, (err, rows) => {
			if (err) {
				reject(err)
			}
			if (rows.length === zero) {
				reject(false)
			} else {
				fufill(rows[zero].salt)
			}
		})
	})
}
