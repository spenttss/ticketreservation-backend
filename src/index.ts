import express from 'express';
import dotenv from 'dotenv';
import { testDatabaseConnection, runDatabaseSetup } from './config/database';
import reservationRoutes from './routes/reservation.routes';
import eventRoutes from './routes/event.routes';
import { globalErrorHandler } from './middlewares/error.middleware'; // 1. Importación del middleware

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 2. Definición de Rutas
app.use('/api/events', eventRoutes);
app.use('/api/reservations', reservationRoutes);

// 3. Manejador Global de Errores
// IMPORTANTE: Debe ir después de las rutas para capturar sus errores.
app.use(globalErrorHandler);

/**
 * Boots the application: Database connection, Schema setup, and Server start.
 */
const startServer = async () => {
  try {
    // Database connectivity check
    await testDatabaseConnection();
    
    // Initial schema and mock data setup
    await runDatabaseSetup();

    app.listen(port, () => {
      console.log(`API Server ready at http://localhost:${port}`);
      console.log(`Endpoint available: POST /api/reservations`);
    });

  } catch (error) {
    // Fallback for errors during the startup process itself
    console.error('Critical error during bootstrap:', (error as Error).message);
    process.exit(1);
  }
};

startServer();