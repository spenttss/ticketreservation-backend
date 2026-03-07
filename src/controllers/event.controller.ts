import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { catchAsync } from '../utils/catchAsync';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  public getAllEvents = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const events = await this.eventService.getAllEvents();
    
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: events
    });
  });
}