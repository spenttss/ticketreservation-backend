import { dbPool } from '../config/database';
import { EventRepository } from '../repositories/event.repository';
import { ReservationRepository } from '../repositories/reservation.repository';
import { Reservation } from '../types';

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

            if (eventResult.rows.length === 0) {
                throw new Error('Event not found');
            }

            const availableTickets = eventResult.rows[0].availableTickets;

            // 2. Business Logic Validation
            if (availableTickets < quantity) {
                throw new Error('Not enough tickets available');
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
            throw error;
        } finally {
            client.release(); // Return the client to the pool
        }
    }
}