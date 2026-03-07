/**
 * Represents an Event entity in the system.
 */
export interface Event {
    id: number;
    name: string;
    totalTickets: number;
    availableTickets: number;
    createdAt: Date;
}