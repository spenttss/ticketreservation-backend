import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';
import { validate } from '../middlewares/validate.middleware';
import { createReservationSchema } from '../schemas/reservation.schema';

const router = Router();
const reservationController = new ReservationController();

router.post(
  '/',
  validate(createReservationSchema),
  reservationController.createReservation,
);

export default router;