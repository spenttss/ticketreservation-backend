import { z } from 'zod';

export const createReservationSchema = z.object({
  body: z.object({
    eventId: z
      .number()
      .int('Event ID must be an integer')
      .positive('Event ID must be a positive number'),

    userId: z
      .number()
      .int('User ID must be an integer')
      .positive('User ID must be a positive number'),

    quantity: z
      .number()
      .int('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1')
      .max(10, 'Cannot reserve more than 10 tickets at once'),
  }),
});