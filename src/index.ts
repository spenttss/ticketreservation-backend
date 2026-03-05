import express from 'express';
import dotenv from 'dotenv';
import { testDatabaseConnection } from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {
    await testDatabaseConnection();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();