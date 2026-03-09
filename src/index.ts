import express from 'express';
import dotenv from 'dotenv';
import { testDatabaseConnection, runDatabaseSetup } from './config/database';
import reservationRoutes from './routes/reservation.routes';
import eventRoutes from './routes/event.routes';
import { globalErrorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/events', eventRoutes);
app.use('/api/reservations', reservationRoutes);

app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await testDatabaseConnection();

    await runDatabaseSetup();

    if (process.env.NODE_ENV !== 'test') {
      app.listen(port, () => {
        console.log(`API Server ready at http://localhost:${port}`);
        console.log(`Endpoint available: POST /api/reservations`);
      });
    }
  } catch (error) {
    console.error('Critical error during bootstrap:', (error as Error).message);
    process.exit(1);
  }
};

startServer();

export default app;