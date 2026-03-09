import { dbPool } from '../config/database';
import { Event } from '../types';

export class EventRepository {
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

  public async getEventById(eventId: number): Promise<Event | null> {
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