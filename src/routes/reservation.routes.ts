import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';

const router = Router();
const reservationController = new ReservationController();

// POST /api/reservations
router.post('/', reservationController.createReservation);

export default router;