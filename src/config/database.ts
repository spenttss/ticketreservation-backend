import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const testDatabaseConnection = async (): Promise<void> => {
  try {
    const client = await dbPool.connect();
    console.log('Successfully connected to the PostgreSQL database.');
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

export const runDatabaseSetup = async (): Promise<void> => {
  try {
    const sqlFilePath = path.join(process.cwd(), 'database', 'init.sql');

    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`CRITICAL: SQL file not found at ${sqlFilePath}`);
    }

    const sqlQuery = fs.readFileSync(sqlFilePath, { encoding: 'utf-8' });

    await dbPool.query(sqlQuery);
    console.log(
      'Database schema initialized successfully from /database/init.sql',
    );
  } catch (error) {
    console.error('Failed to initialize database schema:');
    console.error((error as Error).message);
    process.exit(1);
  }
};