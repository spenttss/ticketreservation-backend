/**
 * Represents a Ticket Reservation entity.
 */
export interface Reservation {
    id: number;
    eventId: number;
    userId: number;
    quantity: number;
    reservationDate: Date;
}