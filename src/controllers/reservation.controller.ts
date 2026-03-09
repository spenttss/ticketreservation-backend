import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservation.service';
import { catchAsync } from '../utils/catchAsync';

export class ReservationController {
  private reservationService: ReservationService;

  constructor() {
    this.reservationService = new ReservationService();
  }

  public createReservation = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { eventId, userId, quantity } = req.body;

      const reservation = await this.reservationService.reserveTickets(
        eventId,
        userId,
        quantity,
      );

      res.status(201).json({
        status: 'success',
        message: 'Reservation successful',
        data: reservation,
      });
    },
  );
}