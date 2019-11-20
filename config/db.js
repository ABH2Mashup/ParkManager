var mysql = require('mysql');

var connection = mysql.createConnection({
	database: 'parkmanager',
	host: "localhost",
	user: "root",
	password: ""
});
connection.connect(function(err) {
	if (err) throw err;
});

module.exports = connection;