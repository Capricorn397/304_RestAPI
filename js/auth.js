'use strict'

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

module.exports.login = (username, password) => {
	console.log('Pre-SQL Request')
	return new Promise((fufill, reject) => {
		const loginQuery = `SELECT username FROM Users \
												WHERE username='${username}' \
												AND password='${password}'`
		pool.query(loginQuery, (err, rows, fields) => {
			if (err) {
				console.log(err)
				reject(err)
			}
			console.log(rows)
			if (rows.length === zero) {
				reject(false)
			} else {
				fufill(rows[zero].username)
			}
		})
		/**pool.getConnection((error, connection) => {
			console.log('Connected')
			connection.query(loginQuery, function(err, result) {
				if (err) {
					console.log(err)
					reject(err)
				}
				if (result.rows.length === zero) {
					reject(false)
					connection.release()
				} else {
					connection.release()
					fufill(result.rows[zero].username)
				}
			})
		})*/
	})
}
