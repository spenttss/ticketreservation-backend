import { dbPool } from '../config/database';
import { Event } from '../types';

export class EventRepository {
  /**
   * Retrieves all events from the database.
   * Useful for listing events in the API.
   */
  public async findAll(): Promise<Event[]> {
    const query = `
        SELECT 
          id, 
          name, 
          total_tickets AS "totalTickets", 
          available_tickets AS "availableTickets", 
          created_at AS "createdAt" 
        FROM events 
        ORDER BY id ASC;
    `;
    
    const result = await dbPool.query(query);
    return result.rows as Event[];
  }

  /**
   * Retrieves an event by its ID from the database.
   * @param eventId - The unique identifier of the event.
   * @returns A promise that resolves to the Event object, or null if not found.
   */
  public async getEventById(eventId: number): Promise<Event | null> {
    // We use parameterized queries ($1) to prevent SQL injection attacks.
    const query = `
        SELECT 
          id, 
          name, 
          total_tickets AS "totalTickets", 
          available_tickets AS "availableTickets", 
          created_at AS "createdAt" 
        FROM events 
        WHERE id = $1;
    `;

    const result = await dbPool.query(query, [eventId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as Event;
  }
}