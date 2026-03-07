import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();
const eventController = new EventController();

// GET /api/events
router.get('/', eventController.getAllEvents);

export default router;