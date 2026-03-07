import { dbPool } from '../config/database';
import { EventRepository } from '../repositories/event.repository';
import { ReservationRepository } from '../repositories/reservation.repository';
import { Reservation } from '../types';
import { AppError } from '../errors/AppError'; // Nueva importación

export class ReservationService {
    private eventRepo: EventRepository;
    private reservationRepo: ReservationRepository;

    constructor() {
        this.eventRepo = new EventRepository();
        this.reservationRepo = new ReservationRepository();
    }

    /**
     * Orchestrates the reservation process using a database transaction.
     * Implements Row-Level Locking to prevent overselling tickets.
     */
    public async reserveTickets(eventId: number, userId: number, quantity: number): Promise<Reservation> {
        // Get a dedicated client from the pool to handle the transaction.
        const client = await dbPool.connect();

        try {
            await client.query('BEGIN'); // Start transaction

            // 1. Get event data with a FOR UPDATE lock.
            // This prevents other transactions from modifying this row until we COMMIT.
            const lockQuery = `
                SELECT id, available_tickets AS "availableTickets" 
                FROM events 
                WHERE id = $1 
                FOR UPDATE;
            `;
            const eventResult = await client.query(lockQuery, [eventId]);

            // VALIDACIÓN: Si el evento no existe, lanzamos 404
            if (eventResult.rows.length === 0) {
                throw new AppError('Event not found', 404);
            }

            const availableTickets = eventResult.rows[0].availableTickets;

            // 2. Business Logic Validation
            // VALIDACIÓN: Si no hay stock, lanzamos 409 (Conflict)
            if (availableTickets < quantity) {
                throw new AppError('Not enough tickets available', 409);
            }

            // 3. Update event availability
            const updateEventQuery = `
                UPDATE events 
                SET available_tickets = available_tickets - $1 
                WHERE id = $2;
            `;
            await client.query(updateEventQuery, [quantity, eventId]);

            // 4. Create reservation record
            const newReservation = await this.reservationRepo.createReservation(client, {
                eventId,
                userId,
                quantity
            });

            await client.query('COMMIT'); // Persist all changes
            return newReservation;

        } catch (error) {
            await client.query('ROLLBACK'); // Cancel everything if something fails
            
            // Si el error ya es una instancia de AppError, lo relanzamos tal cual.
            // Si es un error inesperado de base de datos, lo lanzamos para que el 
            // Global Error Handler lo maneje como un 500.
            throw error;
        } finally {
            client.release(); // Return the client to the pool
        }
    }
}