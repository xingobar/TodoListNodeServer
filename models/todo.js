import mysql from '../lib/mysql';
import sqlString from 'sqlString';
import to from 'await-to-js';

const todo = {
	async get() {
		let sql = `
            SELECT 
            value,complete,uid
            FROM
            ${process.env.DB_NAME}.todolist;
        `;

		let result = await mysql.query(sql);
		return result;
	},

	async insert(params) {
		if (!params) return -1;

		if (params['value'] === undefined || params['uid'] === undefined || params['complete'] === undefined) return -1;

		let sql = sqlString.format(
			`
            INSERT INTO
                ${process.env.DB_NAME}.todolist
            SET 
                value = ?,uid = ?, complete = ?
        `,
			[ params['value'], params['uid'], params['complete'] ]
		);

		let [ error, insert ] = await to(mysql.query(sql));

		if (error) return -2;
		return 1;
	},

	async update({ uid, complete }) {
		if (!uid) return -1;

		let sql = sqlString.format(
			`
            UPDATE 
                ${process.env.DB_NAME}.todolist
            SET
                complete = ?
            WHERE
                uid = ?
        `,
			[ complete, uid ]
		);

		let [ error, updateResult ] = await to(mysql.query(sql));

		if (error) return -2;
		return 1;
	}
};

export default todo;
