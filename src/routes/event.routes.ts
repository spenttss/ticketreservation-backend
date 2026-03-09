import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();
const eventController = new EventController();

router.get('/', eventController.getAllEvents);

export default router;