import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Initialize the database connection pool
export const dbPool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

/**
 * Tests the connection to the PostgreSQL database.
 * Throws an error and exits the process if the connection fails.
 */
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

/**
 * Reads and executes the init.sql file to set up the database schema.
 * This is used for development setup.
 */
export const runDatabaseSetup = async (): Promise<void> => {
    try {
        const sqlFilePath = path.join(__dirname, 'init.sql');
        const sqlQuery = fs.readFileSync(sqlFilePath, { encoding: 'utf-8' });

        // Execute the raw SQL query
        await dbPool.query(sqlQuery);
        console.log('Database schema initialized successfully.');
    } catch (error) {
        console.error('Failed to initialized database schema:', error);
        process.exit(1);
    }
};