import {config} from "../config.js";
import {Pool} from 'pg';

if (!config.databaseURL) {
    throw new Error("DATABASE_URL is missing in environment variables.");
}

const pool = new Pool({
    connectionString: config.databaseURL,
})

export default pool;