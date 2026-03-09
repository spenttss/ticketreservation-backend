import { PoolClient } from 'pg';
import { Reservation } from '../types';

export class ReservationRepository {
  public async createReservation(
    client: PoolClient,
    reservationData: Omit<Reservation, 'id' | 'reservationDate'>,
  ): Promise<Reservation> {
    const query = `
            INSERT INTO reservations (event_id, user_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING id, event_id AS "eventId", user_id AS "userId", quantity, reservation_date AS "reservationDate";
        `;

    const values = [
      reservationData.eventId,
      reservationData.userId,
      reservationData.quantity,
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }
}