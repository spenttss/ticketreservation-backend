import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservation.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../errors/AppError';

export class ReservationController {
  private reservationService: ReservationService;

  constructor() {
    this.reservationService = new ReservationService();
  }

  /**
   * Handles the HTTP request to create a new ticket reservation.
   * Wrapped in catchAsync to forward all errors to the Global Error Handler.
   */
  public createReservation = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Protección: Si req.body es undefined (porque no se enviaron headers JSON), 
    // usamos un objeto vacío para evitar que la desestructuración explote.
    const { eventId, userId, quantity } = req.body || {};

    // 1. Validation: Ahora fallará aquí con un 400 en lugar de un 500.
    if (!eventId || !userId || !quantity) {
      throw new AppError('Missing required fields: eventId, userId, or quantity', 400);
    }

    // 2. Call Service: Procesa la lógica de negocio y el bloqueo de filas.
    const reservation = await this.reservationService.reserveTickets(
      Number(eventId), 
      Number(userId), 
      Number(quantity)
    );

    // 3. Success Response
    res.status(201).json({
      status: 'success',
      message: 'Reservation successful',
      data: reservation
    });
  });
}