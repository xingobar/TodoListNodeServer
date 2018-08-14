import mysql from 'mysql';
import _ from 'lodash';

let connection;
let init = false;

const mysqlConnect = {
	init() {
		connection = mysql.createConnection({
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME
		});

		connection.connect(function(err) {
			if (err) {
				console.error('error connecting: ' + err.stack);
				return;
			}

			console.log('connected as id ' + connection.threadId);
		});
	},

	query(sql) {
		return new Promise((resolve, reject) => {
			if (!sql) {
				return resolve(false);
			}

			connection.query(sql, (err, result, field) => {
				if (err) {
					return reject(err);
				} else {
					let rows = result;

					rows = _.flatten(rows);

					return resolve(rows);
				}
			});
		});
	}
};
if (!init) {
	mysqlConnect.init();
	init = true;
}

export default mysqlConnect;
