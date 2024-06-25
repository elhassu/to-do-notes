import mysql from "mysql2";

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "to_do_notes",
});

/**
 * @typedef {Object} Table
 * @property {string} table
 * @property {string[]} allowedParams
 * @property {string[]} foreignKeys
 */
const tables = {
	USER_TABLE: {
		table: "users",
		allowedParams: ["id", "name", "surname", "email"],
	},
	PASSWORD_TABLE: {
		table: "passwords",
		allowedParams: ["id", "user_id", "password"],
		foreignKeys: ["user_id"],
	},
	SESSION_TABLE: {
		table: "sessions",
		allowedParams: ["id", "identifier", "user_id", "session", "expires_at"],
		foreignKeys: ["user_id"],
	},
	NOTES_TABLE: {
		table: "notes",
		allowedParams: ["id", "title", "content", "user_id"],
	},
};

/**
 * @param {string} sql sql query
 * @param {any[]} params query parameters
 * @returns {Promise<any>} result
 * @throws {Error} if the query fails
 */
async function poolQuery(sql, params = []) {
	return new Promise((resolve, reject) => {
		pool.query(sql, params, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

/**
 * @param {string} table
 * @param {Object} data
 * @returns {Promise<any>}
 * @throws {Error} if the table is not found
 */
async function create(table, data) {
	const sqlTable = tables[table];
	if (!sqlTable) {
		throw new Error(`Table '${table}' not found`);
	}

	const {table: tableName, allowedParams} = sqlTable;

	const newEntry = {};
	const entries = Object.entries(data);

	for (const [key, value] of entries) {
		if (!allowedParams.includes(key)) {
			console.warn(`Key '${key}' not allowed`);
			// or throw an error if you want to stop the operation
			continue;
		}

		newEntry[key] = value;
	}

	const filteredKeys = Object.keys(newEntry);
	const filteredValues = Object.values(newEntry);

	const sql = `
    INSERT INTO ${tableName} (${filteredKeys.join(",")})
    VALUES (${filteredValues.map(() => "?").join(",")})
    `;

    const queryResult = await poolQuery(sql, filteredValues);
    const {insertId} = queryResult[0];

    return insertId;
}

/**
 * @param {string} table
 * @param {number} id
 * @returns {Promise<any>}
 * @throws {Error} if the table is not found
 */
async function get(table, id) {
	const sqlTable = tables[table];
	if (!sqlTable) {
		throw new Error(`Table '${table}' not found`);
	}

	const {table: tableName} = sqlTable;

	const sql = `
    SELECT * FROM ${tableName}
    WHERE id = ?
    `;

    const queryResult = await poolQuery(sql, [id]);
    const [rows] = queryResult;

	return rows[0];
}

async function query(table, foreignKeys) {

	if (!foreignKeys) {
		throw new Error("Foreign keys not provided");
	}

	if (!Array.isArray(foreignKeys)) {
		foreignKeys = [foreignKeys];
	}

	const sqlTable = tables[table];
	if (!sqlTable) {
		throw new Error(`Table '${table}' not found`);
	}

	const {table: tableName, foreignKeys: allowedKeys=[] } = sqlTable;

	if (!allowedKeys.some((key) => foreignKeys.includes(key))){
		throw new Error(`Foreign key '${foreignKeys}' not found`);
	}

	const condition = foreignKeys.map((key) => `${key} = ?`).join(" AND ");

	const sql = `
	SELECT * FROM ${tableName}
	WHERE ${condition}
	`;

	const queryResult = await poolQuery(sql, foreignKeys);
	const [rows] = queryResult;

	return rows;
}

async function list(table) {
	const sqlTable = tables[table];
	if (!sqlTable) {
		throw new Error(`Table '${table}' not found`);
	}

	const {table: tableName} = sqlTable;

	const sql = `
	SELECT * FROM ${tableName}
	`;

	const queryResult = await poolQuery(sql);
	const [rows] = queryResult;

	return rows;
}

/**
 * @param {string} table
 * @param {Object} data
 * @returns {Promise<any>}
 * @throws {Error} if the table is not found
*/
async function update(table, data) {
	const sqlTable = tables[table];
	if (!sqlTable) {
		throw new Error(`Table '${table}' not found`);
	}

	const {table: tableName, allowedParams} = sqlTable;

	const id = data.id;
	delete data.id;

	const newEntry = {};
	const entries = Object.entries(data);

	for (const [key, value] of entries) {
		if (!allowedParams.includes(key)) {
			console.warn(`Key '${key}' not allowed`);
			// or throw an error if you want to stop the operation
			continue;
		}

		newEntry[key] = value;
	}

	const filteredKeys = Object.keys(newEntry);
	const filteredValues = Object.values(newEntry);

	const sql = `
    UPDATE ${tableName}
    SET ${filteredKeys.map((key) => `${key} = ?`).join(",")}
    WHERE id = ?
    `;

	return poolQuery(sql, [...filteredValues, id]);
}

/**
 * @param {string} table
 * @param {number} id
 * @returns {Promise<any>}
 * @throws {Error} if the table is not found
 */
async function remove(table, id) {
	const sqlTable = tables[table];
	if (!sqlTable) {
		throw new Error(`Table '${table}' not found`);
	}

	const {table: tableName} = sqlTable;

	const sql = `
    DELETE FROM ${tableName}
    WHERE id = ?
    `;

    await poolQuery(sql, [id]);
}

export default {
	create,
	query,
	update,
	remove,
	list,
	get,
};

export const TABLES = tables;
