import {drizzle} from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../core/env';
import * as schema from './index.schema';

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

export const database = drizzle(pool, { schema });

export async function testConnection(){
    const result = await database.execute(`SELECT NOW()`);
    return result;
}

export async function closeConnection(){
    return await pool.end();
}