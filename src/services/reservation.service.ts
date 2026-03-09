import { dbPool } from '../config/database';
import { EventRepository } from '../repositories/event.repository';
import { ReservationRepository } from '../repositories/reservation.repository';
import { Reservation } from '../types';
import { AppError } from '../errors/AppError';

export class ReservationService {
  private eventRepo: EventRepository;
  private reservationRepo: ReservationRepository;

  constructor() {
    this.eventRepo = new EventRepository();
    this.reservationRepo = new ReservationRepository();
  }

  public async reserveTickets(
    eventId: number,
    userId: number,
    quantity: number,
  ): Promise<Reservation> {
    const client = await dbPool.connect();

    try {
      await client.query('BEGIN');

      const lockQuery = `
                SELECT id, available_tickets AS "availableTickets" 
                FROM events 
                WHERE id = $1 
                FOR UPDATE;
            `;
      const eventResult = await client.query(lockQuery, [eventId]);

      if (eventResult.rows.length === 0) {
        throw new AppError('Event not found', 404);
      }

      const availableTickets = eventResult.rows[0].availableTickets;

      if (availableTickets < quantity) {
        throw new AppError('Not enough tickets available', 409);
      }

      const updateEventQuery = `
                UPDATE events 
                SET available_tickets = available_tickets - $1 
                WHERE id = $2;
            `;
      await client.query(updateEventQuery, [quantity, eventId]);

      const newReservation = await this.reservationRepo.createReservation(
        client,
        {
          eventId,
          userId,
          quantity,
        },
      );

      await client.query('COMMIT');
      return newReservation;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}