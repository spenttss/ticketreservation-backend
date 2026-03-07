import { PoolClient } from 'pg';
import { Reservation } from '../types';

export class ReservationRepository {
    /**
     * Creates a new reservation record within an existing database transaction.
     * @param client - The active PostgreSQL client for the transaction.
     * @param reservationData - The details of the reservation to be created.
     * @returns A promise that resolves to the created Reservation object.
     */
    public async createReservation(
        client: PoolClient,
        reservationData: Omit<Reservation, 'id' | 'reservationDate'>
        ): Promise<Reservation> {
            // SQL query to insert reservation and return the newly created row.
            const query = `
            INSERT INTO reservations (event_id, user_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING id, event_id AS "eventId", user_id AS "userId", quantity, reservation_date AS "reservationDate";
        `;
        
        const values = [
            reservationData.eventId, 
            reservationData.userId, 
            reservationData.quantity
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }
}