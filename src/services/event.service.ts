import { EventRepository } from '../repositories/event.repository';
import { Event } from '../types';

export class EventService {
  private eventRepo: EventRepository;

  constructor() {
    this.eventRepo = new EventRepository();
  }

  public async getAllEvents(): Promise<Event[]> {
    return await this.eventRepo.findAll();
  }
}