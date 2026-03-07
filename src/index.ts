import express from 'express';
import dotenv from 'dotenv';
import { testDatabaseConnection, runDatabaseSetup } from './config/database';
import { EventRepository } from './repositories/event.repository';
import { ReservationService } from './services/reservation.service';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/**
 * Main function to start the application and run initial tests.
 */
const startServer = async () => {
  try {
    // 1. Database Connection
    await testDatabaseConnection();
    
    // 2. Database Schema Setup
    await runDatabaseSetup();

    // 3. Repository Layer Test
    console.log('--- [TEST] Testing Event Repository ---');
    const eventRepo = new EventRepository();
    // We call the method directly with await, without the 'new' keyword.
    const testEvent = await eventRepo.getEventById(1);
    
    if (testEvent) {
      console.log(`Success: Found event "${testEvent.name}" with ${testEvent.availableTickets} tickets.`);
    } else {
      throw new Error('Test event not found in database.');
    }

    // 4. Service Layer Test (Integration)
    console.log('--- [TEST] Testing Reservation Service (Concurrency Logic) ---');
    const reservationService = new ReservationService();
    // Reserving 5 tickets for Event 1 and User 1
    const reservation = await reservationService.reserveTickets(1, 1, 5);
    
    console.log('Success: Reservation created with ID:', reservation.id);
    console.log('--------------------------------------');

    // 5. Start Server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error('CRITICAL ERROR during bootstrap:');
    console.error((error as Error).message);
    process.exit(1);
  }
};

startServer();